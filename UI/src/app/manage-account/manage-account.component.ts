import { Component, ElementRef, ViewChild } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { environment } from 'src/environments/environment';
import { ElitePlan, OfficePlan, RecruiterPlan } from 'src/environments/payments';
import CardModalComponent from '../paments/card-modal/card-modal.component';
import ConfirmPaymentModalComponent from '../paments/confirm-payment/confirm-payment.component';
import ManualModalComponent from '../paments/phone-modal/manual-modal.component';
import { PaymentPlan } from '../types/payment-plan.type';
import { PaymentRole } from '../types/payment-role.enum';
import { UserDetails } from '../types/user-details.type';
import { addMonth } from '../utils/dateUtils';
import { UserService } from '../_services';
import { PaymentService } from '../_services/payment.service';


@Component({
  selector: 'app-manage-account',
  templateUrl: './manage-account.component.html',
  styleUrls: ['./manage-account.component.scss']
})
export class ManageAccountComponent {
  PaymentRole = PaymentRole // used in template
  planType: PaymentRole;

  @ViewChild(CardModalComponent) cardModal: CardModalComponent
  @ViewChild(ManualModalComponent) manualModal: ManualModalComponent
  @ViewChild(ConfirmPaymentModalComponent) confirmModal: ConfirmPaymentModalComponent

  constructor(
    private paymentService: PaymentService,
    private user: UserService,
    private toastr: ToastrService
  ) { }

  selectManualPlan = (plan: PaymentRole) => {
    this.planType = plan;
    this.manualModal.open();
  }

  selectPlan = (plan: PaymentRole): void => {
    this.planType = plan;
    this.confirmModal.open()
  }

  confirmPayment = () => {
    this.openCardModal();
  }

  onSubmit = async () => {
    const customer = this.user.userDetails as UserDetails

    let paymentPlan: PaymentPlan
    switch (this.planType) {
      case PaymentRole.Recruiter:
        paymentPlan = RecruiterPlan
        break
      case PaymentRole.Office:
        paymentPlan = OfficePlan
        break
      case PaymentRole.Elite:
        paymentPlan = ElitePlan
    }
    const {
      price: paymentAmount,
      monthlyPrice: monthlyAmount,
      purchaseNumber
    } = paymentPlan

    let startDate: Date | string = addMonth(new Date());
    startDate = (startDate as Date).toISOString().slice(0, 10);

    const { CVV, cardNumber, expiryDate, holderName } = this.cardModal.creditCard
    const [firstName, lastName] = holderName.split(' ')

    var authParams = {
      "createTransactionRequest": {
        "merchantAuthentication": {
          "name": environment.transactionLogin,
          "transactionKey": environment.transactionKey
        },
        "transactionRequest": {
          "transactionType": "authOnlyTransaction",
          "amount": paymentAmount,
          "payment": {
            "creditCard": {
              "cardNumber": cardNumber,
              "expirationDate": expiryDate,
              "cardCode": CVV
            }
          },
          "poNumber": purchaseNumber,
          "customer": {
            "id": customer.id,
            "email": customer.Email
          },
          "authorizationIndicatorType": {
            "authorizationIndicator": "final"
          }
        }
      }
    }

    this.paymentService.authorizeCC(authParams).subscribe(res => {
      if (res?.messages?.resultCode !== 'Ok') {
        this.closeCardModal();
        this.toastr.warning('Transaction was unsucessful');
        return
      }

      var subscribeParams = {
        "ARBCreateSubscriptionRequest": {
          "merchantAuthentication": {
            "name": environment.transactionLogin,
            "transactionKey": environment.transactionKey
          },
          "subscription": {
            "name": `${this.planType} subscription`,
            "paymentSchedule": {
              "interval": {
                "length": "1",
                "unit": "months"
              },
              "startDate": startDate,
              "totalOccurrences": "99",
              "trialOccurrences": "1"
            },
            "amount": monthlyAmount,
            "trialAmount": "0.00",
            "payment": {
              "creditCard": {
                "cardNumber": cardNumber,
                "expirationDate": expiryDate,
                "cardCode": CVV,
              }
            },
            "billTo": {
              "firstName": firstName,
              "lastName": lastName
            }
          }
        }
      }

      this.paymentService.debitamountFromBank(subscribeParams).subscribe(res => {
        if (res?.messages?.resultCode === 'Ok') {
          this.closeCardModal();
          this.user.profileUpdate({ Account_Type: this.planType }).subscribe(() => {
            this.toastr.success('Amount has been debited')
          });
        } else {
          this.closeCardModal();
          this.toastr.warning('Transaction was unsucessful');
        }
      }, () => {
        this.closeCardModal();
        this.toastr.warning('Transaction was unsucessful');
      });

    }, () => {
      this.closeCardModal();
      this.toastr.warning('Transaction was unsucessful');
    });
  }

  openCardModal() {
    this.cardModal.open()
  }

  closeCardModal() {
    this.cardModal.close()
  }
}
