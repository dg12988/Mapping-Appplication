import { Component, OnInit, Input, Output, EventEmitter, ViewChild, ViewChildren, ElementRef, destroyPlatform, QueryList, ContentChildren, ChangeDetectorRef} from '@angular/core';
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { ClaimAssignment } from '../model/claimAssignment.model';
import { InfoWindow, google } from '@agm/core/services/google-maps-types';
import { Adjuster } from '../model/adjuster.model';
import { MatCheckbox, MatCheckboxChange, MatOption, MatSelect, MatButtonToggleGroup, MatSelectionList, MatSlider, MatDrawer, MatSlideToggle, MatButtonToggle, MatListOption, MatInput } from '@angular/material';
import { AgmMarker, AgmMap, MarkerManager, AgmCircle, AgmInfoWindow } from '@agm/core';
import 'hammerjs';
import { AgmSnazzyInfoWindowModule, AgmSnazzyInfoWindow } from '@agm/snazzy-info-window';
import { HttpHeaders } from '@angular/common/http'
import { ChangeDetectionStrategy } from '@angular/core';
import { Pipe, PipeTransform } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CookieService } from 'ngx-cookie-service'; 
import { HostListener } from "@angular/core";


// CONSTANTS
const API_KEY: string = 'AIzaSyBabvM40H3sWl7mJzeaSDjzTPRNI_kPNtc';
const CW_URL: string = 'https://claimswire-dev.simsol.com/mapdata/assignments/';
const CW_PUT_URL: string = 'https://claimswire-dev.simsol.com/mapdata/assignments';
const ADJ_URL: string = 'https://claimswire-dev.simsol.com/mapdata/adjusters/';
const GOOGLE_URL: string = "https://maps.googleapis.com/maps/api/geocode/json?address=";
const ADJ_PUT_URL: string ="https://claimswire-dev.simsol.com/mapdata/geo";

@Component({
  selector: 'app-rev-geocode',
  providers: [],
  templateUrl: './rev-geocode.component.html',
  styleUrls: ['./rev-geocode.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
@Injectable()
export class RevGeocodeComponent implements OnInit {

  // styles for map, collapsed
  public mapStyle = [
    {
        "featureType": "administrative",
        "elementType": "labels.text.fill",
        "stylers": [
            {
                "color": "#6195a0"
            }
        ]
    },
    {
        "featureType": "administrative.province",
        "elementType": "geometry.stroke",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "landscape",
        "elementType": "geometry",
        "stylers": [
            {
                "lightness": "0"
            },
            {
                "saturation": "0"
            },
            {
                "color": "#f5f5f2"
            },
            {
                "gamma": "1"
            }
        ]
    },
    {
        "featureType": "landscape.man_made",
        "elementType": "all",
        "stylers": [
            {
                "lightness": "-3"
            },
            {
                "gamma": "1.00"
            }
        ]
    },
    {
        "featureType": "landscape.natural.terrain",
        "elementType": "all",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "poi",
        "elementType": "all",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "poi.park",
        "elementType": "geometry.fill",
        "stylers": [
            {
                "color": "#bae5ce"
            },
            {
                "visibility": "on"
            }
        ]
    },
    {
        "featureType": "road",
        "elementType": "all",
        "stylers": [
            {
                "saturation": -100
            },
            {
                "lightness": 45
            },
            {
                "visibility": "simplified"
            }
        ]
    },
    {
        "featureType": "road.highway",
        "elementType": "all",
        "stylers": [
            {
                "visibility": "simplified"
            }
        ]
    },
    {
        "featureType": "road.highway",
        "elementType": "geometry.fill",
        "stylers": [
            {
                "color": "#fac9a9"
            },
            {
                "visibility": "simplified"
            }
        ]
    },
    {
        "featureType": "road.highway",
        "elementType": "labels.text",
        "stylers": [
            {
                "color": "#4e4e4e"
            }
        ]
    },
    {
        "featureType": "road.arterial",
        "elementType": "labels.text.fill",
        "stylers": [
            {
                "color": "#787878"
            }
        ]
    },
    {
        "featureType": "road.arterial",
        "elementType": "labels.icon",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "transit",
        "elementType": "all",
        "stylers": [
            {
                "visibility": "simplified"
            }
        ]
    },
    {
        "featureType": "transit.station.airport",
        "elementType": "labels.icon",
        "stylers": [
            {
                "hue": "#0a00ff"
            },
            {
                "saturation": "-77"
            },
            {
                "gamma": "0.57"
            },
            {
                "lightness": "0"
            }
        ]
    },
    {
        "featureType": "transit.station.rail",
        "elementType": "labels.text.fill",
        "stylers": [
            {
                "color": "#43321e"
            }
        ]
    },
    {
        "featureType": "transit.station.rail",
        "elementType": "labels.icon",
        "stylers": [
            {
                "hue": "#ff6c00"
            },
            {
                "lightness": "4"
            },
            {
                "gamma": "0.75"
            },
            {
                "saturation": "-68"
            }
        ]
    },
    {
        "featureType": "water",
        "elementType": "all",
        "stylers": [
            {
                "color": "#eaf6f8"
            },
            {
                "visibility": "on"
            }
        ]
    },
    {
        "featureType": "water",
        "elementType": "geometry.fill",
        "stylers": [
            {
                "color": "#c7eced"
            }
        ]
    },
    {
        "featureType": "water",
        "elementType": "labels.text.fill",
        "stylers": [
            {
                "lightness": "-49"
            },
            {
                "saturation": "-53"
            },
            {
                "gamma": "0.79"
            }
        ]
    }
];

  // Variable Declaration
  private adjParam: string;
  private lat = 28.538336;
  private lng = -81.379234;
  public idleTimeoutClear;
  public cwDataArray: ClaimAssignment[];
  private claimsFilterArray: ClaimAssignment[];
  private assignedClaimsArray: [];
  private adjDataArray: Adjuster[];
  private filteredClaimList: ClaimAssignment[];
  private selectedAdj: Adjuster;
  private showOrUpdateString = "Display Claims"
  private assignmentsShown = 0;
  private markerAnimation = 'DROP';
  private selectOrDeselectString = "Select All";
  private showOrHideClaimsString = "Hide Claims";
  private showOrHideClaimsRadiusString = "Hide Radius";
  private showOrHideAdjustersString = "Hide Adjusters";
  private selection = false;
  private radiusZoomFive = 0;
  private radiusZoomTen = 0;
  private radiusZoomFifteen = 0;
  private radiusStroke = 0;
  private radiusOpacity = 0;
  private radiusSelect = 0;
  private radiusLabel = "On Claims";
  private radiusSliderValue = 25;
  private radiusSliderLabel = "5/10/15  Miles";
  private autoRadiusOn = true;
  private showClaimRadius = true;
  private showAdjusters = true;
  private mouseOverLat = 0;
  private mouseOverLng = 0;
  private lastChecked: number;
  private shiftDown = false;
  private finderTitle = "Policy Number";
  private finderAddress1 = "Address";
  private finderAddress2 = "Suite";
  private finderCity = "City";
  private finderState = "State";
  private finderZip = "Zip";
  private finderType = "Claim Type";
  private markerZ = 1;
  private adjZ = 1;
  private zoomMax: number;
  private previousZoom: number;
  private currentZoom: number;
  private selectedFilter: string;
  private filters: string[] = ['None', 'Selected', 'RCBAP', 'Flood Dwelling', 'Flood General', 'Flood Condo', "Home Owner's", 'Fire', 'Property', 'Wind', 'Allied Lines',
"Business Owner's", 'Multi-Peril', 'ICC Dwelling', 'ICC General Property', 'Commercial Business'];
  private filterDataArray: ClaimAssignment[];
  private prevAdjIndex;
  private countSelected = false;
  private isClaimChecked = true;
  private isAdjChecked = false;
  private selectedTab: any;
  private selectedAdjIndex: number;
  private previousSelection;
  public adjDataToPut = [];
  public selectedObject;
  private rightClickCount = 0;


  
  private cardData: ClaimAssignment = {
    "assignmentId": 0,
    "externalAssignmentId": "Claim Number",
    "policyNum": "",
    "Address1": "Address",
    "Address2": "",
    "City": "City",
    "State": "State",
    "Zipcode": "Zip",
    "lat": "",
    "lng": "",
    "isSelected": null,
    "isSubmitted": null,
    "isHidden": null,
    "selectedAdj": null,
    "policyType": "Policy Type",
    "filterString": null,
    "wasRejected": false
  };
  private adjCard: Adjuster = {
    "id": 0,
    "name": "Adjuster Name", 
    "emailAddress": "",
    "FCNNum": "",
    "Address": [""],
    "claimCount": 0, 
    "certs": [""],
    "isSelected": false,
    "lat": null,
    "lng": null,
    "City": "",
    "State": ""
  };    



  @ViewChild ('map') map: AgmMap; 
  @ViewChild ('matOption') matOption: MatOption; 
  @ViewChild ('matSelect') matSelect: MatSelect; 
  @ViewChild ('claimsList') claimsList: MatSelectionList; 
  @ViewChild ('resList') resList: MatSelectionList;
  @ViewChild ('comList') comList: MatSelectionList;
  @ViewChild ('MOBList') MOBList: MatSelectionList;
  @ViewChild ('largeComList') largeComList: MatSelectionList;
  @ViewChild ('rcbapList') rcbapList: MatSelectionList;
  @ViewChild ('radiusSlider') radiusSlider: MatSlider;
  @ViewChild ('cluster') cluster;
  @ViewChild ('searchInput') searchInput;
  @ViewChild ('drawer') drawer: MatDrawer;
  @ViewChild ('claimOrAdjToggle') claimOrAdjToggle: MatButtonToggleGroup;
  @ViewChild ('autoRadiusSlideToggle') autoRadiusSlideToggle: MatSlideToggle;
  @ViewChildren ('checkbox') checkbox;
  @ViewChildren ('marker') marker;

  screenHeight: number;
  screenWidth: number;
  
 constructor(private httpClient: HttpClient, private cdr: ChangeDetectorRef, private route: ActivatedRoute, private cookieService: CookieService ){
    
 // Grabs claim info from CW, Timeout so we don't try to plot the markers before the map is loaded.
   setTimeout(() => {
    this.getCWAssignments();
    
    

   }, 500);

   // Grabs adjuster info from CW, Timeout so we don't try to plot the markers before the map is loaded. 
   setTimeout(() => {
   
    this.getAdjInfo();
    

   }, 700);

    this.getScreenSize();
  }


  // Style: Hide Radius Feature when Screen Width is less than 1250. This is a feature designed for mobile and small window environments.
  @HostListener('window:resize', ['$event'])
    getScreenSize(event?) {
        
          this.screenWidth = window.innerWidth;

          if(this.screenWidth < 1250){
            this.showClaimRadius = false;
          }
          else{
            this.showClaimRadius = true;
          }
         
    }

  // Application will Timeout if mouse is not moved for 10 minutes and the page will route back to the Mass Assignments page on CW. 
    idleTimeout(event){
      if(event.type ==="mousemove"){
        clearTimeout(this.idleTimeoutClear);
        
      }
      
     this.idleTimeoutClear = setTimeout(() => { this.saveAndReload(); }, 600000);
    }
    
    saveAndReload(){
      
      setTimeout(() => { window.location.href = "https://claimswire-dev.simsol.com/claimswire/app/assignments";}, 3000);
    }

  // gets Latitude and Longitude from google JSON query
  getLatLng(data: ClaimAssignment){
    if(data != null){
       let tempAddress1: string;
       let tempAddress2: string;
       let tempCity: string;
       let tempState: string;
       let tempZipcode: string;

       // using String.replace(); to remove spacing and adding + in its place. This dramatically improves the quality of our google geolocation query 
       if(data.Address1 != undefined || data.Address1 != null){  tempAddress1 = data.Address1.replace(/[^A-Z0-9]/ig, "+"); } else { data.Address1 = "";  tempAddress1 = "";}
       if(data.Address2 != undefined || data.Address2 != null){  tempAddress2 = data.Address2.replace(/[^A-Z0-9]/ig, "+");} else { data.Address2 = ""; tempAddress2 = "";}
       if(data.City != undefined || data.City != null){  tempCity = data.City.replace(/[^A-Z0-9]/ig, "+");} else { data.City = ""; tempCity = "";}
       if(data.State != undefined || data.State != null){  tempState = data.State.replace(/[^A-Z0-9]/ig, "+"); } else { data.State = ""; tempState = "";}
       if(data.Zipcode != undefined || data.Zipcode != null){  tempZipcode = data.Zipcode.replace(/[^A-Z0-9]/ig, "+"); } else { data.Zipcode = ""; tempZipcode = "";}

      let googleQuery = GOOGLE_URL 
      + tempAddress1
      + tempAddress2  + "+,"
      + tempZipcode + "&key=" 
      + API_KEY;

      // send the query to google and get the results, storing them in data.lat, data.lng respectively. This cooresponds to the bound properties on the marker object, 
      // which in turn places the markers on the map
      this.httpClient.get(googleQuery).subscribe((res: any)=>{
        
        // Cycles through data received from googleQuery
        if(res.results[0] != undefined && data.Address1 != null){
          data.lat = res.results[0].geometry.location.lat;
          data.lng = res.results[0].geometry.location.lng;
        
          //r represents the data inside of each adress_component element
          //replaces user input for city/state with geolocated data
          for(let r of res.results[0].address_components){
            // console.log(r);
            for(let t of r.types){
            
              if(t == "locality"){
              
                
                data.City = r.long_name;
                
            }
            if(t == "administrative_area_level_1"){
                data.State = r.short_name;
             
             }

           
           }
          }


          data.filterString = data.Address1 + "" 
          + data.Address2 + ", " 
          + data.City + ", " 
          + data.State + " " 
          + data.Zipcode + " " 
          + data.policyNum + " " 
          + data.policyType;    

      
        }
        });
    }
  }


  // gets adjuster info from CW and subscribes it to adjDataArray
  getAdjInfo(){

    // using a URL ID Parameter in query to get the account name so we know what adjusters to request from CW
    let adjParam = this.getParamValueQueryString("id");
    this.httpClient.get(ADJ_URL + adjParam).subscribe((res: Adjuster[])=>{
       
      this.adjDataArray = res; 

    // console.log(res);
      
      for(let d of this.adjDataArray){
        if(d.Address[0] != undefined){
          if(d.Address[0].address1 != "" && d.Address[0].address1 != null){
            if(d.Address[0].latitude === null || d.Address[0].longitude === null){
             
              this.getAdjLatLng(d);

       
           
            }
            else{
              d.lat = d.Address[0].latitude;
              d.lng = d.Address[0].longitude;
            }
           
        }
      }
     

        
    }
    setTimeout(() => {
     
    if(this.adjDataToPut.length != 0){
      this.putAdjLatLng(this.adjDataToPut);   
    }

  }, 1000);
    });

    
  }

  // gets Latitude and Longitude of the Adjusters location from google JSON query
  getAdjLatLng(data: Adjuster){
    if(data != null){
      let tempAddress1: string;
      let tempAddress2: string;
      let tempCity: string;
      let tempState: string;
      let tempZipcode: string;
    
     // using String.replace(); to remove spacing and adding + in its place. This dramatically improves the quality of our google geolocation query 
     if(data.Address[0].address1 != undefined || data.Address[0].address1 != null){  tempAddress1 = data.Address[0].address1.replace(/[^A-Z0-9]/ig, "+"); } else { data.Address[0].address1 = "";  tempAddress1 = "";}
     if(data.Address[0].address2 != undefined || data.Address[0].address2 != null){  tempAddress2 = data.Address[0].address2.replace(/[^A-Z0-9]/ig, "+");} else { data.Address[0].address2 = ""; tempAddress2 = "";}
     if(data.Address[0].city != undefined || data.Address[0].city != null){  tempCity = data.Address[0].city.replace(/[^A-Z0-9]/ig, "+");} else { data.Address[0].city = ""; tempCity = "";}
     if(data.Address[0].state != undefined || data.Address[0].state != null){  tempState = data.Address[0].state.replace(/[^A-Z0-9]/ig, "+"); } else { data.Address[0].state = ""; tempState = "";}
     if(data.Address[0].zipcode != undefined || data.Address[0].zipcode != null){  tempZipcode = data.Address[0].zipcode.replace(/[^A-Z0-9]/ig, "+"); } else { data.Address[0].zipcode = ""; tempZipcode = "";}
     
     let googleQuery = GOOGLE_URL 
     + tempAddress1
     + tempAddress2  + "+,"
     + tempZipcode + "&key=" 
     + API_KEY;
    
      // send the query to google and get the results, storing them in data.lat, data.lng respectively. This cooresponds to the bound properties on the marker object, 
      // which in turn places the markers on the map
      this.httpClient.get(googleQuery).subscribe((res: any)=>{
      
      
        if(res.results[0] != undefined && data.Address[0].address1 != null){
      
          
          data.lat = res.results[0].geometry.location.lat;
          data.lng = res.results[0].geometry.location.lng;

          for(let r of res.results[0].address_components){
            // console.log(r);
            for(let t of r.types){
            
              if(t == "locality"){
              
                data.City = r.long_name;
              
            }
            if(t == "administrative_area_level_1"){
              
                data.State = r.short_name;
             
             }

           
           }
          }


          

          let selectedObject = {"employeeid": data.id, "latitude": data.lat, "longitude": data.lng};
         
          this.adjDataToPut.push(selectedObject);
   

               
    

        }
        else{
    
          data.lat = null;
          data.lng = null;

          let selectedObject = {"employeeid": data.id, "latitude": data.lat, "longitude": data.lng};
         
          this.adjDataToPut.push(selectedObject);
      
        }
      });

     

    }

   
  }

  putAdjLatLng(adjusters: any){
    const headers = new HttpHeaders()
    .set("Content-Type", "application/json");
    
    this.httpClient.put(ADJ_PUT_URL,
        {
         adjusters
        },
        {headers})
        .subscribe(
            val => {
                console.log("PUT call successful", 
                            val);
            },
            response => {
                console.log("PUT call has an error", response);
            },
            () => {
                console.log("The PUT observable is now completed.");
            }
        );
 
  }

  
  // gets assignment info from CW and subscribes it to cwDataArray
  getCWAssignments(){
   
  // using a URL ID Parameter in query to get the account name so we know what claims to request from CW
   let adjParam = this.getParamValueQueryString("id");

    this.httpClient.get(CW_URL + adjParam).subscribe((res: ClaimAssignment)=>{

      
      // res[0] represents new assignments, while r of res[1] represents previously rejected assignments to be assigned again
        this.cwDataArray = res[0];
        // console.log(this.cwDataArray);
     
        for(let r of res[1]){
          r.wasRejected = true;
          this.cwDataArray.push(r);
        }
       
  
               
    
        for(let d of this.cwDataArray){
         //add data from assignment JSON file to query data for geocoding, query google via getLatLng(), pass data back into the array
          this.getLatLng(d);

          // add the properties we need to manipulate that are not provided by CW
          d.isSubmitted = false;
          d.isHidden = false;
         
             
        }

        // slice array to itself is a workaround way to push an update to the DOM 
        this.claimsFilterArray = this.cwDataArray.slice();
        this.filterDataArray = this.cwDataArray.slice();
    
    });

    // For each assignment the adjuster has, raise the counter 1
    this.assignmentsShown++;
    this.showOrUpdate(this.assignmentsShown);

    // sets the max zoom of the map on load, then extends that max so the user can scroll out. This makes sure that the map does not load zoomed very far out
    this.zoomMax = 10;
    setTimeout(() => {
      this.zoomMax = 17;
      this.cdr.detectChanges();
    
    }, 1000);
  
   

  }

  // DEPRECATED
  showOrUpdate(assignmentsShown: number){
    if(assignmentsShown > 0){
      this.showOrUpdateString = "Refresh Claims";
    }

    
  }

  

  // called when a change is made to the adjuster selection
  changeAdjuster(index: number, nestedIndex: number){
       let count = 0;
  
   // sets isSelected property to true when that user is selected
   this.adjDataArray[index].isSelected = true;
   
   // Selects the adjuster from the DDL
   this.matSelect.options.toArray()[index].select();
   
   // sets the selectedAdj property to our selected adjuster
   this.selectedAdj = this.adjDataArray[index];

    

    // iterates over the adjDataArray marking the non-selected objects to false
    for(let data of this.adjDataArray){
      if(data != this.adjDataArray[index]){
        data.isSelected = false;
        
      }
      else{
    
      for(let d of this.resList.options.toArray()){
      
        if(d.value === index){
          d.selected = true;
        }
        else{
          d.selected = false;
        }
      }  

      for(let d of this.MOBList.options.toArray()){
      
        if(d.value === index){
          d.selected = true;
        }
        else{
          d.selected = false;
        }
      }     
      for(let d of this.comList.options.toArray()){
      
        if(d.value === index){
          d.selected = true;
        }
        else{
          d.selected = false;
        }
      }     
      for(let d of this.largeComList.options.toArray()){
      
        if(d.value === index){
          d.selected = true;
        }
        else{
          d.selected = false;
        }
      }     
      for(let d of this.rcbapList.options.toArray()){
      
        if(d.value === index){
          d.selected = true;
        }
        else{
          d.selected = false;
        }
      }     
       
       
       //sets the ID card
      this.adjCard = data;
      this.finderType = "Adjuster";
      this.finderTitle = this.adjCard.name + " [" + data.claimCount + "]";

      if(this.adjCard.Address[0] != undefined){
        this.finderAddress1 = this.adjCard.Address[0].address1;
        this.finderAddress2 = this.adjCard.Address[0].address2;
        this.finderCity = this.adjCard.Address[0].city;
        this.finderState = this.adjCard.Address[0].state;
        this.finderZip = this.adjCard.Address[0].zipcode;
      }
      else{
        this.finderAddress1 = "";
        this.finderAddress2 = "";
        this.finderCity = "";
        this.finderState = "";
        this.finderZip = "";
      }
    }
   
   
    }   

  }

  // executes when a claim is clicked in the list
  claimClicked(event: any, data: any, searchText){
        
    // toggles marker selection on click
    data.isSelected = !data.isSelected;
    

    // updates info card to claim type/info
    this.cardData = data;
    this.finderType = this.cardData.policyType;
    this.finderTitle = this.cardData.policyNum;
    // NOTE TO SELF UPDATE TO NEW ADJ MODEL
    this.finderAddress1 = this.cardData.Address1;
    this.finderAddress2 = this.cardData.Address2;
    this.finderCity = this.cardData.City;
    this.finderState = this.cardData.State;
    this.finderZip = this.cardData.Zipcode;

    // When delimiting the claim list via live search, the following code effects the behavior of the Select All button. When delimited by a 3, or greater, search text 
    // character input, the select all button will change its state based on the filtered list 
    if(searchText.length < 3){
      let count = 0;
     
  
      for(let d of this.cwDataArray){
        if(d.isSelected === true)
        {
          count++;
        }
      
      }
      
      if(count === this.cwDataArray.length && this.cwDataArray.length != 0){
       
        this.selectOrDeselectString = "Deselect All";
         this.countSelected = true;
      }
      else{
        
        this.selectOrDeselectString = "Select All";
        this.countSelected = false;
      }
    }
    else{
      let count = 0;
      let filteredClaimList = this.cwDataArray.filter(claims => claims.filterString.toLowerCase().indexOf(searchText.toLowerCase()) !== -1);
  
      for(let d of filteredClaimList){
        if(d.isSelected === true)
        {
          count++;
        }
      
      }
      
      if(count === filteredClaimList.length && filteredClaimList.length != 0){
       
        this.selectOrDeselectString = "Deselect All";
         this.countSelected = true;
      }
      else{
        
        this.selectOrDeselectString = "Select All";
        this.countSelected = false;
      }
    }

  }

// executes when a marker is clicked
  markerClicked(event: any, data: ClaimAssignment, searchText){

    // transitions the right pane to Claims To Assign
    this.selectedTab = 0;  

    // Toggles whether the marker is selected or not
    if(data.isSelected === false || data.isSelected === undefined){
      data.isSelected = true;
         
      //sets the ID card
      this.cardData = data;
      this.finderType = this.cardData.policyType;
      this.finderTitle = this.cardData.policyNum;
      // NOTE TO SELF UPDATE TO NEW ADJ MODEL
      this.finderAddress1 = this.cardData.Address1;
      this.finderAddress2 = this.cardData.Address2;
      this.finderCity = this.cardData.City;
      this.finderState = this.cardData.State;
      this.finderZip = this.cardData.Zipcode;

    }
    else{
      data.isSelected = false;
    
      
    }

     // When delimiting the claim list via live search, the following code effects the behavior of the Select All button. When delimited by a 3, or greater, search text 
    // character input, the select all button will change its state based on the filtered list 
    if(searchText.length < 3){
      let count = 0;
     
  
      for(let d of this.cwDataArray){
        if(d.isSelected === true)
        {
          count++;
        }
      
      }
      
      if(count === this.cwDataArray.length && this.cwDataArray.length != 0){
       
        this.selectOrDeselectString = "Deselect All";
         this.countSelected = true;
      }
      else{
        
        this.selectOrDeselectString = "Select All";
        this.countSelected = false;
      }
    }
    else{
      let count = 0;
      let filteredClaimList = this.cwDataArray.filter(claims => claims.filterString.toLowerCase().indexOf(searchText.toLowerCase()) !== -1);
  
      for(let d of filteredClaimList){
        if(d.isSelected === true)
        {
          count++;
        }
      
      }
      
      if(count === filteredClaimList.length && filteredClaimList.length != 0){
       
        this.selectOrDeselectString = "Deselect All";
         this.countSelected = true;
      }
      else{
        
        this.selectOrDeselectString = "Select All";
        this.countSelected = false;
      }
    }
    

    
  }

  // executes when an adjuster marker is clicked
  adjClicked(i: number, data: Adjuster, matOption){
    this.selectedTab = 3;

    //sets the ID card
    this.adjCard = data;
    this.finderType = "Adjuster";
    this.finderTitle = this.adjCard.name + " [" + data.claimCount + "]";
    // NOTE TO SELF UPDATE TO NEW ADJ MODEL
    this.finderAddress1 = this.adjCard.Address[0].address1;
    this.finderAddress2 = this.adjCard.Address[0].address2;
    this.finderCity = this.adjCard.Address[0].city;
    this.finderState = this.adjCard.Address[0].state;
    this.finderZip = this.adjCard.Address[0].zipcode;

     //changes the adjuster in both the array and the ddl
    this.changeAdjuster(i, matOption);
  }

  // sets z-index property bound to the adjster/claim markers. This allows you to right click and swap which marker type is in front of the other
  markerRightClick(){
    this.rightClickCount++;

    if(this.rightClickCount % 2){
      this.markerZ = 999;
    }
    else{
      this.markerZ = 0;
    }
    // console.log(this.markerZ);
  }

  // DEPRECATED
  isCheckedShift(){
    this.shiftDown = true;
    
  
  }

   // DEPRECATED
  isCheckedShiftUp(){
    this.shiftDown = false;
  }

  // executes on Select All/Deselect All button press
  selectAll(cwDataArray: ClaimAssignment[], searchText){

  // Start filtering after the 2nd character
   if(searchText.length < 3){
   
    //when list is not filtered
     if(this.cwDataArray != undefined){

      // countSelected represents if all claims are selected
      if(this.countSelected === false){

        // for each claim, if its submitted deselect, else select, if all selected change button text to deselect and countSelect to true  
        for(let cwData of this.cwDataArray){
             
          if(cwData.isSubmitted === true){
          
            cwData.isSelected = false;
          
          }
          else{
           
           
              cwData.isSelected = true;
                       
            }
  
              
          }   
          this.selectOrDeselectString = "Deselect All"
          this.countSelected = true;  
    
        }
  
       // if countSelect is not true, then all the claims are not selected 
      else{
        for(let cwData of this.cwDataArray){
             
                
            cwData.isSelected = false;
         
        }
              
        this.claimsList.deselectAll();
        this.selectOrDeselectString = "Select All";
        this.countSelected = false;
    
        }
      }
    }

  else{
    //when list is filtered
    this.filteredClaimList = this.cwDataArray.filter(claims => claims.filterString.toLowerCase().indexOf(searchText.toLowerCase()) !== -1);

    if(this.filteredClaimList != undefined){
    
      // countSelected represents if all claims are selected
      if(this.countSelected === false){

        // for each claim, if its submitted deselect, else select, if all selected change button text to deselect and countSelect to true  
        for(let cwData of this.filteredClaimList){
             
          if(cwData.isSubmitted === true){
          
            cwData.isSelected = false;
          
          }
          else{
                      
              cwData.isSelected = true;
                       
            }
  
              
          }   
          this.selectOrDeselectString = "Deselect All"
          this.countSelected = true;  
    
        }
  
      // if countSelect is not true, then all the claims are not selected 
      else{
        for(let cwData of this.filteredClaimList){
             
                
            cwData.isSelected = false;
         
        }
              
        this.claimsList.deselectAll();
        this.selectOrDeselectString = "Select All";
        this.countSelected = false;
    
        }
      }
    }
   }
    

// DEPRECATED
 selectOrDeselect(selection: boolean){

  if(selection === false){
    this.selectOrDeselectString = "Deselect All";

  }
  else{
    this.selectOrDeselectString = "Select All";
  }
  
}


// changes the text on the Show/Hide Claims button in the Map Filters section, also sets a cookie for future use
showOrHideClaims(selection: boolean){
  
  if(selection === true){
    this.showOrHideClaimsString = "Show Claims";
    

  }
  else{
    this.showOrHideClaimsString = "Hide Claims";
  }
   this.cookieService.set('showOrHideClaimsString', this.showOrHideClaimsString, null, null, null, false, 'Lax');
   this.cookieService.set('showOrHideClaims', selection.toString(), null, null, null, false, 'Lax');

}

//determines marker visibility 
hiddenOrSubmitted(data: any){
  if(data.isSubmitted === true || data.isHidden === true){
    
    return false;
  }
  else{
    return true;
  }
}

//toggles isHidden property on click
onHideClaims(cwDataArray: ClaimAssignment[]){
  if(this.cwDataArray != null){

  
    for(let data of this.cwDataArray){
        data.isHidden = !data.isHidden
        
        this.showOrHideClaims(data.isHidden);
        
    }
  }
  else{
    alert('No Claims to Hide');
  }

}

// When mousing over a claim marker, show radius
claimMouseOver(event: any, data: any){
 this.showClaimRadius = true;
 this.onMapChange(event);
// if there is no data parameter, then you've moused over a marker
  if(data.name === undefined){
    if(this.radiusSelect === 0){
      this.mouseOverLat = event.coords.lat;
      this.mouseOverLng = event.coords.lng;
    }  

    // place data on info card
    this.cardData = data;
    this.finderType = this.cardData.policyType;
    this.finderTitle = this.cardData.policyNum;
    // NOTE TO SELF UPDATE TO NEW ADJ MODEL
    this.finderAddress1 = this.cardData.Address1;
    this.finderAddress2 = this.cardData.Address2;
    this.finderCity = this.cardData.City;
    this.finderState = this.cardData.State;
    this.finderZip = this.cardData.Zipcode;
  }

// if there is no externalAssignmentId parameter, then you've moused over an adjuster marker
  if(data.externalAssignmentId === undefined){
    if(this.radiusSelect === 1){
      this.mouseOverLat = event.coords.lat;
      this.mouseOverLng = event.coords.lng;
    }

    // place data on info card
    this.adjCard = data;
    this.finderType = "Adjuster";
    this.finderTitle = this.adjCard.name + " [" + data.claimCount + "]";
    // NOTE TO SELF UPDATE TO NEW ADJ MODEL
    this.finderAddress1 = this.adjCard.Address[0].address1;
    this.finderAddress2 = this.adjCard.Address[0].address2;
    this.finderCity = this.adjCard.Address[0].city;
    this.finderState = this.adjCard.Address[0].state;
    this.finderZip = this.adjCard.Address[0].zipcode;
  }

}


// on mouse out move the radius to the middle of nowhere
claimMouseOut(event: any, data: any){
  this.mouseOverLat = 0;
  this.mouseOverLng = 0;

  this.showClaimRadius = false;
}

// toggles whether the radius is shown on Claims or Adjusters via button press located in the Map Filters section 
isClaimOrAdjRadius(event: MatButtonToggle){
  if(event.value === "0"){
    this.radiusSelect = 0;
  }
  
  else{
    this.radiusSelect = 1;
  }

  // adds cookie for radius type selector
  this.cookieService.set('radiusSelect', this.radiusSelect.toString(), null, null, null, false, 'Lax');  
  }


// corresponds to the hide/show claim radius button in the Map Filters section
showOrHideClaimRadius(){

  this.showClaimRadius = !this.showClaimRadius;

  if(this.showOrHideClaimsRadiusString === "Hide Radius")
  {
    this.showOrHideClaimsRadiusString = "Show Radius";
   
  }
  else{
    this.showOrHideClaimsRadiusString = "Hide Radius";
 
  }

  // adds cookie for selection
   this.cookieService.set('showOrHideClaimsRadiusString', this.showOrHideClaimsRadiusString, null, null, null, false, 'Lax');
   this.cookieService.set('showClaimsRadius', this.showClaimRadius.toString(), null, null, null, false, 'Lax');
}

// corresponds to the hide/show Adjusters button in the Map Filters section
showOrHideAdjusters(){
  this.showAdjusters = !this.showAdjusters;

  if(this.showOrHideAdjustersString === "Hide Adjusters"){
    this.showOrHideAdjustersString = "Show Adjusters";
  }
  else{
    this.showOrHideAdjustersString = "Hide Adjusters";
  }

  // adds cookie for show/hide adjuster selection
  this.cookieService.set('showOrHideAdjustersString', this.showOrHideAdjustersString, null, null, null, false, 'Lax');
  this.cookieService.set('showAdjusters', this.showAdjusters.toString(), null, null, null, false, 'Lax');
}

// Sets label for slider
formatLabel(value: number | null) {
      if (!value) {
        this.radiusSliderLabel = "2/4/8  Miles";
        return ("2/4/8  Miles");
      }
      if (value === -50){
        this.radiusSliderLabel = "0.1/0.3/0.5  Miles";
        return("0.1/0.3/0.5  Miles");
      }
    if (value === -25){
      this.radiusSliderLabel = "0.5/1/2  Miles";
      return ("0.5/1/2  Miles");
    }   
    if (value === 0){
      this.radiusSliderLabel = "2/4/8  Miles";
      return ("2/4/8  Miles");
    }     
    if (value === 25){
      this.radiusSliderLabel = "5/10/15  Miles";
      return ("5/10/15  Miles");
     
    }
    if (value === 50){
      this.radiusSliderLabel = "10/25/50  Miles";
      return ("10/25/50  Miles");
    }
    if (value === 75){
      this.radiusSliderLabel = "25/50/75  Miles";
      return ("25/50/75  Miles");
    }
    if (value === 100){
      this.radiusSliderLabel = "50/75/100  Miles";
      return ("50/75/100  Miles");
    }
    if (value === 125){
      this.radiusSliderLabel = "100/250/500  Miles";
      return ("100/250/500  Miles");
    }

}

// set slider to desired radius on manual selection from Map Filters section, must turn off auto radius to use this feature
sliderChange(event: MatSlider){


  this.radiusSliderValue = event.value;
 

  if(this.radiusSliderLabel != "Hidden"){  
    if (event.value === -50){
      this.radiusSliderLabel = "0.1/0.3/0.5  Miles";
    
    }
    if (event.value === -25){
      this.radiusSliderLabel = "0.5/1/2  Miles";
    
    }
    if (event.value === 0){
      this.radiusSliderLabel = "2/4/8  Miles";
    
    }
    if (event.value === 25){
      this.radiusSliderLabel = "5/10/15  Miles";
      
    }
    if (event.value === 50){
      this.radiusSliderLabel = "10/25/50  Miles";
    
    }
    if (event.value === 75){
      this.radiusSliderLabel = "25/50/75  Miles";
  
    }
    if (event.value === 100){
      this.radiusSliderLabel = "50/75/100  Miles";
    
    }
    if (event.value === 125){
      this.radiusSliderLabel = "100/250/500  Miles";
    
    }
    
  }



}

  // submits the assignments to server
  submitAssignments(cwDataArray: ClaimAssignment[]){


    // if statement is error check if assignment has not been loaded yet
    if(cwDataArray != null && this.selectedAdj != null) {
          // temporary array and index to store selected data objects
          let selectedData = [];
          let prevRejectSelectedData = [];
        
          // iterates through the data array and adds selected markers to selectedData
          for(let d of cwDataArray){
            if (d.isSelected){
              if(d.wasRejected === true){
                let selectedObj = {"id": d.assignmentId, "adjId": this.selectedAdj.id};
                prevRejectSelectedData.push(selectedObj);
              }
              else{
 
                let selectedObj = {"id": d.assignmentId, "adjId": this.selectedAdj.id};
                selectedData.push(selectedObj);
              }
          //sets marker as submitted, so it no longer gets selected
             d.isSubmitted = true;
             d.isHidden = true;
             this.selectedAdj.claimCount++;
            }
        
           
        
          }
         
          //filters the submitted data and returns those elements that were not submitted, then updates the array
          this.claimsFilterArray = cwDataArray.filter(cwDataArray => {
           return cwDataArray.isSubmitted === false;
          });
          
          this.cwDataArray = this.claimsFilterArray.slice();
       

          // sends to server via PUT
          if(selectedData.length != 0 || prevRejectSelectedData.length != 0)
          {
            
            this.serverPut(selectedData, prevRejectSelectedData); 
      
            for(let d of selectedData){
              d.isSelected = false;
         
            } 
            alert('Assignments Submitted');
          }
          
          else{
          alert('Make a Selection');
          } 
      }
      else{
          if(cwDataArray === null){
          alert("You must first click 'Show Claims'");
          } 
          else{
            alert("Please select an Adjuster");
          }
      }
  }


  // method for PUT data to the server via httpClient
  serverPut(assignments: any, reassignments: any){
    const headers = new HttpHeaders()
    .set("Content-Type", "application/json");

    this.httpClient.put(CW_PUT_URL,
        {
         assignments,
         reassignments
        },
        {headers})
        .subscribe(
            val => {
                console.log("PUT call successful", 
                            val);
            },
            response => {
                console.log("PUT call has an error", response);
            },
            () => {
                console.log("The PUT observable is now completed.");
            }
        );
 
  }


  // toggles the Auto Radius feature
  isAutoRadius(){

    this.autoRadiusSlideToggle.focus;
    this.autoRadiusOn = !this.autoRadiusOn;
       
    if(!this.autoRadiusOn){
      this.radiusSlider.value = this.radiusSliderValue;
    }
  
  }
  

  //gets parameter name
  getParamValueQueryString( paramName ) {
    const url = window.location.href;
    let paramValue;
    if (url.includes('?')) {
      const httpParams = new HttpParams({ fromString: url.split('?')[1] });
      paramValue = httpParams.get(paramName);
     
    }
    return paramValue;
  }

  // opens the drawer pane when pressing the Map Filters button
  openDrawer(){
    
    this.drawer.toggle();
    
  }

// Delicious
  bakeCookies(){
    if((this.cookieService.get('showOrHideClaimsString')) != ""){

      this.showOrHideClaimsString = this.cookieService.get('showOrHideClaimsString');
      
      if(this.showOrHideClaimsString === "Show Claims"){
        setTimeout(() => {
          for(let data of this.cwDataArray){
            data.isHidden = !data.isHidden
          }
      }, 1000);
    }
  }

  if((this.cookieService.get('radiusSelect')) === "" || (this.cookieService.get('radiusSelect')) === "0"){
    this.radiusSelect = 0;
    this.isClaimChecked = true;
    this.isAdjChecked = false;
  }
  else{
    this.radiusSelect = 1;
    this.isClaimChecked = false;
    this.isAdjChecked = true;
  }

  if((this.cookieService.get('showOrHideAdjustersString')) != ""){

    this.showOrHideAdjustersString = this.cookieService.get('showOrHideAdjustersString');
  
  }

  if((this.cookieService.get('showAdjusters') == "false")) 
  {
    this.showAdjusters = false;
    
  }
  else{
    this.showAdjusters = true;
  }


  if(this.cookieService.get('showOrHideClaimsRadiusString') != ""){
    this.showOrHideClaimsRadiusString = this.cookieService.get('showOrHideClaimsRadiusString')
  }
  
  if((this.cookieService.get('showClaimsRadius') == "false")) 
  {
    this.showClaimRadius = false;
    
  }
  else{
    this.showClaimRadius = true;
  }
  
  

  }

  
  ngOnInit() {
      // gets cookies and uses them to determine proper variable states for user selection
      this.bakeCookies();
      
  }
  
  

  
  ngDoCheck(){

  }

  // corresponds to the Filter Select tab in the right hand menu
  filterSelect(searchText){
    
    this.cwDataArray = this.filterDataArray.slice();

    if(this.selectedFilter === 'None'){
      this.cwDataArray = this.filterDataArray.slice();
    }
    if(this.selectedFilter === 'Selected'){
      this.cwDataArray = this.cwDataArray.filter(claims => { return claims.isSelected === true; });
    }
    if(this.selectedFilter === 'RCBAP'){
      this.cwDataArray = this.cwDataArray.filter(claims => { return claims.policyType === "RCBAP"; });
    }
    if(this.selectedFilter === 'Flood Dwelling'){
      this.cwDataArray = this.cwDataArray.filter(claims => { return claims.policyType === "Flood Dwelling"; });
    }
    if(this.selectedFilter === 'Flood General'){
      this.cwDataArray = this.cwDataArray.filter(claims => { return claims.policyType === "Flood General"; });
    }
    if(this.selectedFilter === 'Flood Condo'){
      this.cwDataArray = this.cwDataArray.filter(claims => { return claims.policyType === "Flood Condo"; });
    }
    if(this.selectedFilter === "Home Owner's"){
      this.cwDataArray = this.cwDataArray.filter(claims => { return claims.policyType === "Home Owner's"; });
    }
    if(this.selectedFilter === 'Fire'){
      this.cwDataArray = this.cwDataArray.filter(claims => { return claims.policyType === "Fire"; });
    }
    if(this.selectedFilter === 'Property'){
      this.cwDataArray = this.cwDataArray.filter(claims => { return claims.policyType === "Property"; });
    }
    if(this.selectedFilter === 'Wind'){
      this.cwDataArray = this.cwDataArray.filter(claims => { return claims.policyType === "Wind"; });
    }
    if(this.selectedFilter === "Business Owner's"){
      this.cwDataArray = this.cwDataArray.filter(claims => { return claims.policyType === "Business Owner's"; });
    }
    if(this.selectedFilter === 'Allied Lines'){
      this.cwDataArray = this.cwDataArray.filter(claims => { return claims.policyType === "Allied Lines"; });
    }
    if(this.selectedFilter === 'Multi-Peril'){
      this.cwDataArray = this.cwDataArray.filter(claims => { return claims.policyType === "Multi-Peril"; });
    }
    if(this.selectedFilter === 'ICC Dwelling'){
      this.cwDataArray = this.cwDataArray.filter(claims => { return claims.policyType === "ICC Dwelling"; });
    }
    if(this.selectedFilter === 'ICC General Property'){
      this.cwDataArray = this.cwDataArray.filter(claims => { return claims.policyType === "ICC General Property"; });
    }
    if(this.selectedFilter === 'Commercial Business'){
      this.cwDataArray = this.cwDataArray.filter(claims => { return claims.policyType === "Commercial Business"; });
    }


    // search text delimited. If search text is present when a filter is selected from above, and the search length is greater than 2, then use a filtered list
    if(searchText.length < 3){
      let count = 0;
     
  
      for(let d of this.cwDataArray){
        if(d.isSelected === true)
        {
          count++;
        }
      
      }
      
      if(count === this.cwDataArray.length && this.cwDataArray.length != 0){
       
        this.selectOrDeselectString = "Deselect All";
         this.countSelected = true;
      }
      else{
        
        this.selectOrDeselectString = "Select All";
        this.countSelected = false;
      }
    }
    else{
      let count = 0;
      let filteredClaimList = this.cwDataArray.filter(claims => claims.filterString.toLowerCase().indexOf(searchText.toLowerCase()) !== -1);
  
      for(let d of filteredClaimList){
        if(d.isSelected === true)
        {
          count++;
        }
      
      }
      
      if(count === filteredClaimList.length && filteredClaimList.length != 0){
       
        this.selectOrDeselectString = "Deselect All";
         this.countSelected = true;
      }
      else{
        
        this.selectOrDeselectString = "Select All";
        this.countSelected = false;
      }
    }
  
  }

  //handles Radius and Auto Radius
  onMapChange(event){
 
    
    if(this.autoRadiusOn){
      if(this.map.zoom < 17 && this.map.zoom > 3){
     
        if(this.map.zoom < 16){
          this.radiusSliderValue = -50;
          this.radiusSliderLabel = "0.1/0.3/0.5 Miles";
        }
        if(this.map.zoom < 15){
          this.radiusSliderValue = -25;
          this.radiusSliderLabel = "0.5/1/2  Miles";
          
          }
        if(this.map.zoom < 13){
          this.radiusSliderValue = 0;
          this.radiusSliderLabel = "2/4/8  Miles";
          
          }
          if(this.map.zoom < 12){
          this.radiusSliderValue = 25;
          this.radiusSliderLabel = "5/10/15  Miles";
          
          }
          if(this.map.zoom < 10){
            this.radiusSliderValue = 50;
            this.radiusSliderLabel = "10/25/50  Miles";
        
            
          }
          if(this.map.zoom < 9){
            this.radiusSliderValue = 75;
            this.radiusSliderLabel = "25/50/75  Miles";
            
          }
          if(this.map.zoom < 8){
           
            this.radiusSliderValue = 100;
            this.radiusSliderLabel = "50/75/100  Miles";
            
          }
          if(this.map.zoom < 7){
           
            this.radiusSliderValue = 125;
            this.radiusSliderLabel = "100/250/500  Miles";
            
          }
          if(this.radiusSliderValue === -50)
          {
          this.radiusZoomFive = 160.934;
          this.radiusZoomTen = 482.803;
          this.radiusZoomFifteen = 804.672;
          this.radiusStroke = 5;
          this.radiusOpacity = .1;
          }
          if(this.radiusSliderValue === -25)
          {
          this.radiusZoomFive = 804.672;
          this.radiusZoomTen = 1609.34;
          this.radiusZoomFifteen = 3218.69;
          this.radiusStroke = 5;
          this.radiusOpacity = .1;
          }
          if(this.radiusSliderValue === 0)
          {
          this.radiusZoomFive = 3218.69;
          this.radiusZoomTen = 6437.38;
          this.radiusZoomFifteen = 12874.8;
          this.radiusStroke = 5;
          this.radiusOpacity = .1;
          }
            
          if(this.radiusSliderValue === 25)
          {
          this.radiusZoomFive = 8046.72;
          this.radiusZoomTen = 16093.4;
          this.radiusZoomFifteen = 24140.2;
          this.radiusStroke = 5;
          this.radiusOpacity = .1;
          }
          if(this.radiusSliderValue === 50)
          {
          this.radiusZoomFive = 16093.4;
          this.radiusZoomTen = 40233.6;
          this.radiusZoomFifteen = 80467.2;
          this.radiusStroke = 5;
          this.radiusOpacity = .1;
          }
          if(this.radiusSliderValue === 75)
          {
          this.radiusZoomFive = 32186.9;
          this.radiusZoomTen = 80467.2;
          this.radiusZoomFifteen = 120701;
          this.radiusStroke = 5;
          this.radiusOpacity = .1;
          }
          if(this.radiusSliderValue === 100)
          {
          this.radiusZoomFive = 80467.2;
          this.radiusZoomTen = 120701;
          this.radiusZoomFifteen = 160934;
          this.radiusStroke = 5;
          this.radiusOpacity = .1;
          }
          if(this.radiusSliderValue === 125)
          {
          this.radiusZoomFive = 160934;
          this.radiusZoomTen = 402336;
          this.radiusZoomFifteen = 804672;
          this.radiusStroke = 5;
          this.radiusOpacity = .1;
          }

      }

       
       
     }
     else{

           if(this.radiusSliderValue === -50)
           {
           this.radiusZoomFive = 160.934;
           this.radiusZoomTen = 482.803;
           this.radiusZoomFifteen = 804.672;
           this.radiusStroke = 5;
           this.radiusOpacity = .1;
           }
      
           if(this.radiusSliderValue === -25)
           {
           this.radiusZoomFive = 804.672;
           this.radiusZoomTen = 1609.34;
           this.radiusZoomFifteen = 3218.69;
           this.radiusStroke = 5;
           this.radiusOpacity = .1;
           }
           if(this.radiusSliderValue === 0)
           {
          this.radiusZoomFive = 3218.69;
          this.radiusZoomTen = 6437.38;
          this.radiusZoomFifteen = 12874.8;
          this.radiusStroke = 5;
          this.radiusOpacity = .1;
           }
           if(this.radiusSliderValue === 25)
           {
           this.radiusZoomFive = 8046.72;
           this.radiusZoomTen = 16093.4;
           this.radiusZoomFifteen = 24140.2;
           this.radiusStroke = 5;
           this.radiusOpacity = .1;
           }
           if(this.radiusSliderValue === 50)
           {
           this.radiusZoomFive = 16093.4;
           this.radiusZoomTen = 40233.6;
           this.radiusZoomFifteen = 80467.2;
           this.radiusStroke = 5;
           this.radiusOpacity = .1;
           }
           if(this.radiusSliderValue === 75)
           {
           this.radiusZoomFive = 32186.9;
           this.radiusZoomTen = 80467.2;
           this.radiusZoomFifteen = 120701;
           this.radiusStroke = 5;
           this.radiusOpacity = .1;
           }
           if(this.radiusSliderValue === 100)
           {
           this.radiusZoomFive = 80467.2;
           this.radiusZoomTen = 120701;
           this.radiusZoomFifteen = 160934;
           this.radiusStroke = 5;
           this.radiusOpacity = .1;
           }
           if(this.radiusSliderValue === 125)
           {
           this.radiusZoomFive = 160934;
           this.radiusZoomTen = 402336;
           this.radiusZoomFifteen = 804672;
           this.radiusStroke = 5;
           this.radiusOpacity = .1;
           }
         }

         this.previousZoom = this.map.zoom;
  }


  trackByFn(index) {
    return index;
  }

  // execute various operations after keypress on live search area
  public keydownSearch(event, searchText){

    // if the even key is a deletion type key execute the following code, we implement this to differentiate the data we receive in the keyup and keydown events. 
    if(event.key === "Backspace" || event.key === "Delete" || event.type === "contextmenu" || ((event.ctrlKey || event.metaKey) && event.keyCode == 88)){
      
      // simulate our filter pipe in ts, if less than 3 characters, don't filter the list
      if(searchText.length < 3){
    

      let unfilteredClaimList = this.cwDataArray;
      let count = 0;
    
      for(let data of unfilteredClaimList){
      
        if(data.isSelected === true){
          count++;
        }
      }
      // if the count of selected items is equal to the length of the full claim list, than everything is selected, else not everything is selected.
      if(count === unfilteredClaimList.length && unfilteredClaimList.length != 0){
        this.selectOrDeselectString = "Deselect All";
        this.countSelected = true;
      }
      else{
        this.selectOrDeselectString = "Select All";
        this.countSelected = false;
      }

     
    }
    // if the search text is long enough, than filter the list by that data
    else{
      
       let filteredClaimList = this.cwDataArray.filter(claims => claims.filterString.toLowerCase().indexOf(searchText.toLowerCase()) !== -1);
      
     
       let count = 0;
      if(filteredClaimList != undefined){
      for(let data of filteredClaimList){
      
        if(data.isSelected === true){
          count++;
        }
      }
    
    // we do some strange things here with the length of the search text. This is due to the data recieved by a deletion key on a keydown as opposed to the data received by keyup.  
      let searchLength = searchText.length - 1;
    
    // if the count of selected items is equal to the length of the filtered claim list and the search length is less than 4, than everything is selected, else not everything is selected.
      if(count === filteredClaimList.length && searchLength < 4){
        this.selectOrDeselectString = "Deselect All";
        this.countSelected = true;
      }
      else{
    
        this.selectOrDeselectString = "Select All";
        this.countSelected = false;
      }

    }
  }
}
// if the even key is a forward key
else{

  // simulate filter pipe in ts, if less than 3 characters, do not filter list
  if(searchText.length < 2){


  let unfilteredClaimList = this.cwDataArray;
  let count = 0;
  if(unfilteredClaimList != undefined){
  for(let data of unfilteredClaimList){
  
    if(data.isSelected === true){
      count++;
    }
  }

  // if the count of selected items is equal to the length of the full claim list, than everything is selected, else not everything is selected.
  if(count === unfilteredClaimList.length && unfilteredClaimList.length != 0){
    this.selectOrDeselectString = "Deselect All";
    this.countSelected = true;
  }
  else{
    this.selectOrDeselectString = "Select All";
    this.countSelected = false;
  }

}
 
}
// a forward key was pressed that resulted in a live search text string greater than 2 characters triggering a filtered claim list
else{

  // filter the claim list by the search text filter string
   let filteredClaimList = this.cwDataArray.filter(claims => claims.filterString.toLowerCase().indexOf(searchText.toLowerCase()) !== -1);
  let count = 0;
  if(filteredClaimList != undefined){
  for(let data of filteredClaimList){
  
    if(data.isSelected === true){
      count++;
    }
  }

  filteredClaimList =  this.cwDataArray.filter(claims => claims.filterString.toLowerCase().indexOf(searchText.toLowerCase()) !== -1);


// if the count of selected items is equal to the length of the filtered claim list, than everything is selected, else not everything is selected.
  if(count === filteredClaimList.length && searchText.length > 2 && filteredClaimList.length != 0){
    this.selectOrDeselectString = "Deselect All";
    this.countSelected = true;
  }
  else{
    this.selectOrDeselectString = "Select All";
    this.countSelected = false;
   }

  }
 }
}
   
}
// event binded to the ngModel of claim list setting the data received from the filter pipe equal to the claim list, limiting our list on the screen 
  public onSelectedOptionsChange(event) {
    
    this.filteredClaimList = event;


  }


}

