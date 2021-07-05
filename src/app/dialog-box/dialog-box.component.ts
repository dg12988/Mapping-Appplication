import { Component, OnInit } from '@angular/core';
import {MatDialogModule, MatDialog} from '@angular/material/dialog';

@Component({
  selector: 'app-dialog-box',
  templateUrl: './dialog-box.component.html',
  styleUrls: ['./dialog-box.component.css']
})
export class DialogBoxComponent implements OnInit {

  constructor(public dialog: MatDialog) {}
  
  feedbackDialog(){
    //window.open("https://web.simsol.com/eforms/claimswire-mapping-beta-feedback/61/","_blank");
    const dialogRef = this.dialog.open(DialogBoxComponent, {
      width: '250px'
      
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
     
    });
  }

  ngOnInit() {
  }

}
