import { Component, Input, OnInit, TemplateRef, ViewChild } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { MatDialog, MatDialogConfig, MatDialogRef } from "@angular/material/dialog";
import { ToastrService } from "ngx-toastr";
import { Observable } from "rxjs";
import { MAX_DOCUMENT_SIZE } from "src/app/constants/maxDocumentSize";
import { LandingPage } from "src/app/types/landingPage.type";
import { LandinPageService } from "src/app/_services/landingpage.service";

@Component({
	selector: 'landing-page-form',
	templateUrl: './landing-page-form.component.html',
	styleUrls: ['./landing-page-form.component.scss']
})
export class LandingPageForm implements OnInit {
	form: FormGroup;
	thumbnail: File;
	preview: File;
	page?: LandingPage; 

	@Input() onSubmit: Function = () => { }

	@ViewChild('pageForm') pageForm: TemplateRef<any>;
	private addLandingPageDialogRef: MatDialogRef<TemplateRef<any>>;

	constructor(
		private dialog: MatDialog,
		private fb: FormBuilder,
		private toster: ToastrService,
		private landingService: LandinPageService
	) { }

	ngOnInit(): void {
		this.form = this.fb.group({
			name: [''],
			usedBy: [''],
			random: [false],
			status: [''],
		})
	}

	open(page?: LandingPage) {
		const dialogConfig = new MatDialogConfig();
		dialogConfig.role = 'dialog';
		this.addLandingPageDialogRef = this.dialog.open(this.pageForm, dialogConfig);

		if (page) {
			this.page = page
			this.form.patchValue({
				name: page.name,
				random: page.random,
				usedBy: page.usedBy,
				status: page.status
			})
		} else {
			this.page = null;
			this.form.patchValue({
				name: '',
				usedBy: '',
				random: false,
				status: ''
			})
		}
	}

	close() {
		this.addLandingPageDialogRef.close();
	}

	submit() {
		const name = this.form.value.name
		const usedBy = this.form.value.usedBy
		const status = this.form.value.status

		// Optional file update for existing record
		if (!this.page && !this.thumbnail) {
			this.toster.error("Please add file")
			return
		} else if (!name || !status) {
			this.toster.error("Please enter all fields")
			return
		} else if (this?.preview?.size > MAX_DOCUMENT_SIZE) {
			this.toster.error("Maximum preview size is  20 MB ");
			return
		}

		const formData = new FormData();
		if (this.thumbnail) {
			formData.append('thumbnail', this.thumbnail);
		}
		if (this.preview) {
			formData.append('preview', this.preview);
		}
		formData.append('name', name);
		formData.append('usedBy', usedBy)
		formData.append('status', status)
		formData.append('random', String(!!this.form.value.random))

		var templateDetails = {
			templateName: this.form.value.name,
			agentName: this.form.value.usedBy
		};

		let action: Observable<LandingPage>
		if (!this.page) {
			action = this.landingService.addLandingPage(formData)
		} else {
			action = this.landingService.updateLandingPage(formData, this.page.id)
		}

		action.subscribe(() => {
			this.landingService.getLandingTemplates().subscribe(data => {
				if (data.length > 0) {
					if (data.findIndex(d => d.templateName === templateDetails.templateName) < 0) {
						this.landingService.addLandingTemplate(templateDetails)
					}
				} else {
					this.landingService.addLandingTemplate(templateDetails)
				}
				this.onSubmit()
			});
			if (this.page) {
				this.toster.success('Page updated successfully')
			} else {
				this.toster.success('Page added successfully')
			}
		}, () => {
			if (this.page) {
				this.toster.error('Falied to edit page, please try again')
			} else {
				this.toster.error('Falied to add page, please try again')
			}
		})
		this.close();
	}

	onFileChanged(event: Event) {
		const target = event.currentTarget as HTMLInputElement
		this.thumbnail = target.files && target.files[0];
	}

	onPreviewChanged(event: Event) {
		const target = event.currentTarget as HTMLInputElement
		this.preview = target.files && target.files[0];
	}
}