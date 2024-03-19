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

  query_choice = [
    ['3D', '2D', 'cartoony'],
    ['Isometric', 'sideways', 'front ', 'back', 'portrait'],
    ['Baby', 'adult', 'young'],
    ['Fire', 'water', 'earth', 'magic'],
    ['Dragon', 'Dinosaur ', 'shark', 'monster', 'human', 'Country side', 'Green field'],
    ['Banner', 'poster', 'background', 'game Character'],
  ];
  query_chosen: string[][] = this.query_choice.map((x) => [x[0]]);
  query_builder: string[] = ['...', '...', '...', '...'];
  query: string = this.build_query();

  warning: string = '';
  imageSrc: string | null = null;
  imageLoading: boolean = false;

  history: any[] = [];
  selectedHistory: any = null;

  build_query() {
    const query =
      'Generate a ' +
      this.query_chosen[0].join('/') + //['3D', '2D', 'cartoony'],
      ' ' +
      this.query_chosen[1].join('/') + //['Isometric', 'sideways', 'front ', 'back', 'portrait'],
      ' image of a ' +
      this.query_chosen[2].join('/') + //['Baby', 'adult', 'young'],
      ' ' +
      this.query_chosen[3].join('/') + //['Fire', 'water', 'earth', 'magic'],
      ' ' +
      this.query_chosen[4].join('/') + //['Dragon', 'Dinosaur ', 'shark', 'monster', 'human', 'Country side', 'Green field'],
      ' for a ' +
      this.query_chosen[5].join('/') //['Banner', 'poster', 'background', 'game Character'],;
    return query;
  }

  generateImage() {
    this.imageLoading = true;
    this.imageSrc = null;
    this.warning = '';

    for (let q of this.query_builder) {
      if (q === '...') {
        this.warning = 'Please fill in all fields';
        return;
      }
    }

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
