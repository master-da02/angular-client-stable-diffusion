import { Component } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  constructor(private http: HttpClient) {
    this.http.get(`${this.baseURL}/database/history`).subscribe((data: any) => {
      this.history = data;
      console.log(data);
    });
  }

  baseURL: string = 'https://fpg-stabe-diffussion.herokuapp.com';
  apiKey: string =
    '5MqpLpSJY3vBIPyWYQKZTzSlG9TF7JeZZeclqQT8jKYt7lHjkKQLr7HwCvox' as const;
  imageGenerateURL = `${this.baseURL}/stableDiffussion/textToImage`;


  query_choice_header = [
    'view', 'view', 'character', 'character', 'character', 'background', 'output type'
  ]
  query_choice = [
    ['3D', '2D', 'cartoony'],
    ['Isometric', 'sideways', 'front ', 'back', 'portrait'],
    ['Baby', 'adult', 'young'],
    ['Fire', 'water', 'earth', 'magic'],
    ['Dragon', 'Dinosaur ', 'shark', 'monster', 'human'],
    ['Country side', 'Green field'],
    ['Banner', 'poster', 'background', 'game Character'],
  ];
     
  model_choice: string[] = ['2D Art', 'Samaritan 3D', 'Cartoon-ish']
  model_choice_selected: string = this.model_choice[0];
  query_choice_selected: boolean[][] = this.query_choice.map((x) => x.map((_, idx) => idx ? false : true));
  query: string = this.build_query();

  warning: string = '';
  imageSrc: string | null = null;
  imageLoading: boolean = false;

  history: any[] = [];
  selectedHistory: any = null;

  build_query() {    
    
    const query =
      'Generate a ' +
      this.query_choice[0].filter((_, i) => this.query_choice_selected[0][i] == true).join('/') +   // ['3D', '2D', 'cartoony'],
      ' ' +
      this.query_choice[1].filter((_, i) => this.query_choice_selected[1][i] == true).join('/') +   // ['Isometric', 'sideways', 'front ', 'back', 'portrait'],
      ' image of a ' +
      this.query_choice[2].filter((_, i) => this.query_choice_selected[2][i] == true).join('/') +   // ['Baby', 'adult', 'young'],
      ' ' +
      this.query_choice[3].filter((_, i) => this.query_choice_selected[3][i] == true).join('/') +   // ['Fire', 'water', 'earth', 'magic'],
      ' ' +
      this.query_choice[4].filter((_, i) => this.query_choice_selected[4][i] == true).join('/') +   // ['Dragon', 'Dinosaur ', 'shark', 'monster', 'human'],
      ' in a ' +
      this.query_choice[5].filter((_, i) => this.query_choice_selected[5][i] == true).join('/') +   // ['Country side', 'Green field'],
      ' for a ' +
      this.query_choice[6].filter((_, i) => this.query_choice_selected[6][i] == true).join('/') +    // ['Banner', 'poster', 'background', 'game Character'],;
      ' with a ' + 
      this.model_choice_selected +
      ' style';
    return query;
  }

  generateImage() {
    this.imageLoading = true;
    this.imageSrc = null;

    const payload = { prompt: this.query, samples: 1 };
    const generator = this.http.post(this.imageGenerateURL, payload);

    generator.subscribe((data: any) => {
      if (data.status == 'success') this.imageSrc = data.output[0];
      else this.warning = 'An error occured, please try again';
      this.imageLoading = false;
    });
  }

  displayHistory() {
    this.imageSrc = this.selectedHistory.img_url;
    this.warning = this.selectedHistory.prompt;
  }
}
