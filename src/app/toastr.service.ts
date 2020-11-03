import { Injectable } from '@angular/core';
declare var toastr:any
@Injectable({
  providedIn: 'root'
})
export class ToastrService {

  constructor() { toastr.options = {
  "closeButton": false,
  "debug": false,
  "newestOnTop": false,
  "progressBar": false,
  "positionClass": "toast-top-center",
  "preventDuplicates": false,
  "onclick": null,
  "showDuration": "300",
  "hideDuration": "1000",
  "timeOut": "5000",
  "extendedTimeOut": "1000",
  "showEasing": "swing",
  "hideEasing": "linear",
  "showMethod": "fadeIn",
  "hideMethod": "fadeOut"
}}

  Success(title :string,message?:string){
    toastr.options.showEasing = 'swing';
    toastr.options.timeOut = 9000;
    toastr.options.closeHtml = '<button><i class="icon-off"></i></button>';
    
    toastr.success(title,message);
  }
  Warning(title :string,message?:string){
    toastr.warning(title,message);
  }
  Error(title :string,message?:string){
    toastr.error(title,message);
  }
  Info(message:string){
    toastr.info(message);
  }
}
