import { Injectable } from "@angular/core";
import { Plan } from "src/app/interfaces/plan";


@Injectable({
  providedIn: 'root'
})
export class PlanService {

    constructor() { }
    

    getSelectedPlan(titulo:string,plans: Plan[]): Plan{
        return plans.find(el=>el.titulo==titulo)
    }

}
