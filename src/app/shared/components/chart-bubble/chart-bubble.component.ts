import { Component, Input, HostBinding, OnChanges } from '@angular/core';

@Component({
  selector: 'chart-bubble',
  templateUrl: './chart-bubble.component.html',
  styleUrls: ['./chart-bubble.component.scss']
})
export class ChartBubbleComponent implements OnChanges {

  @Input() size: number = 0;
  @Input() color: string = "#000";
  @Input() maxSize: number = 100;

  @HostBinding("style.height") fixedHeight = "100px";

  style: any = {};

  constructor() { }

  ngOnChanges() {

    const size = Math.min(this.maxSize, this.size);

    this.fixedHeight = this.maxSize + "px";

    this.style = {
      width: size + "px",
      height: size + "px",
      "border-radius": size / 2 + "px",
      margin: (this.maxSize - size) / 2 + "px 0",
      "background-color": this.color
    };
  }
}
