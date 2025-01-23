import { formatCurrency } from '../scripts/utils/money.js';

class Product {
  id;
  image;
  name;
  rating;
  priceCents;
  keywords;

  constructor({ id, image, name, rating, priceCents, keywords }) {
    this.id = id;
    this.image = image;
    this.name = name;
    this.rating = rating;
    this.priceCents = priceCents;
    this.keywords = keywords;
  }

  getStarsUrl() {
    return `images/ratings/rating-${this.rating.stars * 10}.png`;
  }

  getPrice() {
    return `$${formatCurrency(this.priceCents)}`;
  }

  extraInfoHTML() {
    return '';
  }
}

export class Clothing extends Product {
  sizeChartLink;

  constructor(productDetails) {
    super(productDetails);
    this.sizeChartLink = productDetails.sizeChartLink;
  }

  extraInfoHTML() {
    // super.extraInfoHTML();
    return `<a href="${this.sizeChartLink}" target="_blank">Size Chart</a>`;
  }
}

export let products = [];

export function loadProductsFetch() {
  const promise = fetch('backend/products.json')
    .then((response) => {
      return response.json();
    })
    .then((productsData) => {
      products = productsData.map((productDetails) => {
        if (productDetails.type === 'clothing') {
          return new Clothing(productDetails);
        }
        return new Product(productDetails);
      });
      console.log('load products');
    }); /*.catch((error)=>{
      console.log('Unexpected error. Please try again later',error);
    })*/

  return promise;
}


export function loadProducts(fun) {
  const xhr = new XMLHttpRequest();

  xhr.addEventListener('load', () => {
    products = JSON.parse(xhr.response).map((productDetails) => {
      if (productDetails.type === 'clothing') {
        return new Clothing(productDetails);
      }
      return new Product(productDetails);
    });
    console.log('load products');
    fun();
  });
  xhr.addEventListener('error', (error) => {
    console.log('Upexpected error. Please try again later');
  });
  xhr.open('GET', 'backend/products.json');
  xhr.send();
}

export function getProduct(productId) {
  let matchingItem;
  products.forEach((product) => {
    if (productId === product.id) {
      matchingItem = product;
    }
  });
  return matchingItem;
}