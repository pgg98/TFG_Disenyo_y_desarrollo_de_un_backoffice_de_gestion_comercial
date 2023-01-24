import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'phoneCode'
})
export class PhoneCode implements PipeTransform {

  transform(codes: string): string[] {
    let code = codes.split(',')[0];
    let codeFormat;
    if(code.length > 3) {
      codeFormat = code.charAt(0) + ` (${code.slice(1)})`; 
    } else { 
      codeFormat = codes.split(',')[0];
    }
    return [code, codeFormat];
  }
}