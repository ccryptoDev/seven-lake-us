import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TeamInformationComponent } from './team-information/team-information.component';
import { TeamInformationRouting } from './teaminformation.routing';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatTableModule} from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import {MatCheckboxModule} from '@angular/material/checkbox';
import { FormsModule } from '@angular/forms';
import {MatTreeModule} from '@angular/material/tree';
import { MatIconModule } from '@angular/material/icon';
import { PipesModule } from '../_pipes/pipes.module';

@NgModule({
  declarations: [TeamInformationComponent],
  imports: [
    CommonModule,
    TeamInformationRouting,
    MatTableModule,
    MatFormFieldModule,
    MatInputModule,
    MatCheckboxModule,
    FormsModule,
    MatIconModule,
    MatTreeModule,
    PipesModule, 
  ],
  exports:[MatTreeModule]
})
export class TeaminformationModule { }
