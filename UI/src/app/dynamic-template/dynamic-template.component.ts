import { Component, Directive, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { LandinPageService } from '../_services/landingpage.service';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../_services/user.service';
@Directive({selector: 'IframeTracker'})
class frame{
  
  @HostListener('click', ['$event.target'])
  onClick(btn) {
    console.log('button', btn);
  }
}


@Component({
  selector: 'app-dynamic-template',
  templateUrl: './dynamic-template.component.html',
  styleUrls: ['./dynamic-template.component.scss']
})
export class DynamicTemplateComponent implements OnInit {
  @HostListener('window:message',['$event'])
  onMessage(e){
    console.log("Hostlistener : ", e.data);
  }
  @HostListener('window:keydown.enter',['$event'])
  onInput(value) {
    console.log(value)
  }

  @HostListener('click')
  onClick(btn) {
    console.log(btn);
  }
  @HostListener('keydown',['$event'])  
  url: string = "";
  urlMap: SafeResourceUrl;
  userId = '';
  dynamicurl=true;
  @ViewChild('myiframe') iframe: ElementRef;
  //iframe =document.getElementById('myiframe');
  constructor(public sanitizer: DomSanitizer, private landingService: LandinPageService, private ele: ElementRef,
              public activatedRoute:ActivatedRoute,private userService:UserService,  public router: Router,) { }
             
  ngOnInit(): void {
    this.userId = this.activatedRoute.snapshot.paramMap.get("id");
    this.userService.getZohoToken().subscribe(response => {
      this.userService.token = response.tokenResponse.access_token;
      this.userService.getAgentsByMemberCode(this.userId).subscribe((data) => {
        var mailId = data.agent[0].Email;
        this.landingService.getLandingTemplates().subscribe((templates) => {
          if (templates.length > 0) {
            var details = templates.filter(y => y.agentName !== null && y.agentName.includes(mailId));
            if (details.length > 0) {
              this.url = details[0].templateName;
              var domain1 = this.landingService.getHostname();
              var domain2 = data.agent[0].Website.split('/')[2];
              if (domain1 === domain2 || domain1 === "localhost") {
                this.dynamicurl = true;
              } else {
                this.dynamicurl = false;
              }
              this.urlMap = this.sanitizer.bypassSecurityTrustResourceUrl(this.url);
              window.addEventListener('blur', function (event) {
                //alert('Blur event'); 
                console.log(event);
              });
              document.getElementsByTagName('iframe')[0].addEventListener('blur', function () {
                alert("Blur");
              })
            } else {
              this.router.navigate(['/register'])
            }
          } else {
            this.router.navigate(['/register'])
          }
        }), (error) => {
          this.router.navigate(['/register'])
        };
      });
    });
  }

  ifameLoad(){
    debugger;
    alert("IFrameLoad");
    var n =this.iframe.nativeElement.contenWindow.document.getElementById('input_2') ;
    this.iframe.nativeElement.contenWindow.addEventListener('click',function(event){
      if(document.activeElement.id == 'myiframe'){
        console.log(event)
        alert('buttonClicked');
      }
    });
      
  }
  clickIframe(event){
    console.log(event);
    alert('onclick');
  }
  @HostListener('mouseover')
  OnClickEvent(e)
{
  console.log("Click :",e);
}
@HostListener('blur')
  blurEvent(e)
{
  console.log("blur :",e);
}
  
}
