import { Injectable } from "@angular/core";
import { Clipboard } from "@angular/cdk/clipboard";
import { TranslocoService } from "@ngneat/transloco";
import { Router, UrlSerializer } from "@angular/router";
import moment from "moment";

@Injectable({ providedIn: 'root' })
export class CommonService {
  constructor(
    private clipboard: Clipboard,
    private router: Router,
    private serializer: UrlSerializer,
    private translocoService: TranslocoService
  ) { }

  /**
   * Copy textToCopy to clipboard
   * @param textToCopy
   */
  copyTextToClipboard(textToCopy: string): void {
    this.clipboard.copy(textToCopy);
  }

  /**
   * Function to translate an objet to a determinate language
   * @param object objetc to translate
   * @param language translation language
   */
  translateObject(object: any, id: string, language: string): Object {
    this.translocoService.setActiveLang(language)
    const keyValues = Object.keys(object).map(key => {
      const newKey = this.translocoService.translate("object."+id+"."+key) || key;
      return { [newKey]: object[key] };
    });
    return Object.assign({}, ...keyValues);
  }

   /* Get url string with query params in correct formar
   * @param url url string to concatenate
   * @param obj query params
   * @returns new url formatted
   */
  serializeParamsQuery(url: string, obj: Object = {}): string {
    obj = JSON.parse(JSON.stringify(obj));
    let entries = Object.entries(obj);
    entries.forEach(([key, value]) => {
      if(value === null || value === undefined) delete obj[key];
    })
    const tree = this.router.createUrlTree([url], { queryParams: obj });
    return this.serializer.serialize(tree);
  }

  /**
   * Transform moment date to string yyyy-mm-dd
   * @param date
   */
  convertMomentDateToString(date: any): string {
    return moment(date).toISOString(true).split('T')[0]
  }
}
