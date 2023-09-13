import { CanActivateFn, Router } from '@angular/router';
import {inject} from '@angular/core';
import { ChecklistService } from './checklist.service';

export const authGuard: CanActivateFn = (route, state) => {
  if(inject(ChecklistService).session){
    return true;
  } else{
    inject(Router).navigate(['/login']);
    return false;

  }
};
