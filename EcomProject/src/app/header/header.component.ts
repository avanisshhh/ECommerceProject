import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { product } from '../data-type';
import { ProductService } from '../services/product.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit {
  searchResult: undefined | product[];
  constructor(private route: Router, private product: ProductService) {}
  menuType = 'default';
  sellerName = '';
  userName: string = '';
  cartItems=0;
  ngOnInit(): void {
    this.route.events.subscribe((val: any) => {
      if (val.url) {
        //console.warn(val.url);
        if (localStorage.getItem('seller') && val.url.includes('seller')) {
          //console.warn('in seller area');
          this.menuType = 'seller';
          if (localStorage.getItem('seller')) {
            let sellerStore = localStorage.getItem('seller');
            let sellerData = sellerStore && JSON.parse(sellerStore)[0]; //convert json string to json object
            this.sellerName = sellerData.name;
          }
        } else if (localStorage.getItem('user')) {
          let userStore = localStorage.getItem('user');
          let userData = userStore && JSON.parse(userStore);
          this.userName = userData.name;
          this.menuType = 'user';
          this.product.getCartList(userData.id); //to load page properly with data
        } else {
          //console.warn('outside seller');
          this.menuType = 'default';
        }
      }
    });

    //For cart item numbers/items
    let cartData=localStorage.getItem('localCart');
    if(cartData){
      this.cartItems=JSON.parse(cartData).length;
    }
    this.product.cartData.subscribe((items) => {
      this.cartItems=items.length
    })
   
  }
  logout() {
    localStorage.removeItem('seller');
    this.route.navigate(['/']);
    this.product.cartData.emit([]); //to empty data on logout
  }
  userLogOut(){
    localStorage.removeItem('user');
    this.route.navigate(['/user-auth']);

  }

  searchProduct(query: KeyboardEvent) {
    if (query) {
      const element = query.target as HTMLInputElement; //

      this.product.searchProducts(element.value).subscribe((result) => {
        //console.warn(result, 'search result');
        this.searchResult = result;
        if (result.length > 5) {
          result.length = 5;
        }
      });
    }
  }
  hideSearch() {
    this.searchResult = undefined;
  }

  submitSearch(val: string) {
    console.warn(val);
    this.route.navigate([`search/${val}`]);
  }
  redirectToDetails(id: number) {
    this.route.navigate([`/details/${id}`]);
  }
}
