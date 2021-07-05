import { Pipe, PipeTransform } from '@angular/core';

// The purpose of this pipe is to filter the search results based on the user's typed/entered info
@Pipe({ name: 'searchInput' })
export class ClaimFilterPipe implements PipeTransform {
  public transform(claims: any[], searchText: any): any {
    // return the full list of claims if there is nothing written in the search, or there are no claims
    if (searchText == null || claims == null) {
      return claims;
    }

    // only start filtering the search after 2 characters to avoid lag
    if(searchText.length > 2){
      // If selected radio button is selected, filter claims by search text, and selection. Otherwise return search text filtered claims whether selected or not.
      if(searchText.toLowerCase() === "selected"){
        return claims.filter(claims => { return claims.isSelected === true; });
      }
      return claims.filter(claims => claims.filterString.toLowerCase().indexOf(searchText.toLowerCase()) !== -1);
    }
    
    // if all else fails, return the unfilitered claim list
    else{
      return claims;
    }
  }
}