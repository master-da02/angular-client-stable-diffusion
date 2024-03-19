import { Component } from '@angular/core';

import { HttpClient } from '@angular/common/http';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  constructor(
    private http: HttpClient
  ) {
      this.http.get(`${this.baseURL}/database/history`).subscribe((data: any) => {
        this.history = data
        console.log(data)
      })
  }

  baseURL: string = "https://fpg-stabe-diffussion.herokuapp.com"
  apiKey: string = "5MqpLpSJY3vBIPyWYQKZTzSlG9TF7JeZZeclqQT8jKYt7lHjkKQLr7HwCvox" as const
  imageGenerateURL = `${this.baseURL}/stableDiffussion/textToImage`

  query_choice = [
    ['An isometric', 'A 3D'],
    ['Baby', 'Adult'],
    ['Dragon', 'Dinosaur'],
    ['Banner', 'Poster', 'Game Resource']
  ]

  query_builder: string[] = ["...", "...", "...", "..."]
  query: string = this.build_query()

  warning: string = ""
  imageSrc: string | null = null
  imageLoading: boolean = false

  history: any[] = []
  selectedHistory: any = null

  build_query(x: any = null) {
    try {

      // I did some very hacky stuff here to use radiobuttons as togglebuttons instead of usign two way data bindings.

      const targetElementLabel = x.originalEvent.target.parentNode.parentNode.parentNode.parentNode.childNodes[1].childNodes[0].childNodes[0]

      let target = x.originalEvent.target.parentNode
      while (!target.id.includes('parent')) target = target.parentNode
      
      // get list of childnodes of target
      let children = target.childNodes
      for (let child of children){
        try {
          child.childNodes[1].childNodes[0].childNodes[0].classList.remove("p-highlight")
        } catch {}
      }

      targetElementLabel.classList.add("p-highlight")
        
    } catch (e){}

    // constructs a query from the query_builder array "generate a <query_builder[0]> <query_builder[1]> <query_builder[2]> for a <query_builder[3]>"
    this.query = ["Generate", ...this.query_builder.slice(0, 3), "for a", this.query_builder[3]].join(' ')
    return this.query
  }

  generateImage() {

    this.imageLoading = true
    this.imageSrc = null
    this.warning = ""

    for (let q of this.query_builder) {
      if (q === '...') {
        this.warning = 'Please fill in all fields'
        return
      }
    }


    const payload = {prompt: this.query, samples: 1}
    const generator = this.http.post(this.imageGenerateURL, payload)

    generator.subscribe((data: any) => {
      if (data.status == 'success')
        this.imageSrc = data.output[0]
      else
        this.warning = 'An error occured, please try again'
      this.imageLoading = false
    })
  }
  
  displayHistory() {
    this.imageSrc = this.selectedHistory.img_url
    this.warning = this.selectedHistory.prompt
  }

}
