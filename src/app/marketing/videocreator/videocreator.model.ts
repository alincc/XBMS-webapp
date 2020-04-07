import { ChartDataSets, ChartOptions, Chart } from 'chart.js';
import { Color, BaseChartDirective, Label } from 'ng2-charts';

export class chart {
    type: 'chart';
    groupmember: false;
    start_time: number;
    charttype: string;
    src: string;
    posx: number;
    posy: number;
    setpos: object;
    id: string;
    animation: animationtype[];
    motionpath: string;
    transform: string;
    motionrotation: number;
    rotation: number;
    label: Label[] = [];
    data: any;
    productiondata: any;
    //options:
    colors: Color[] = [
      { // grey
        backgroundColor: '#232222',
        borderColor: '#232222',
        pointBackgroundColor: '#232222',
        pointBorderColor: '#fff'
      }
    ]
    legend: true;
    style: {
      'z-index': number,
      width: string;
      height: string;
      position: 'absolute';
      opacity: 1;
      'box-shadow': string;
    }
    lineChartOptions: ChartOptions = {
      legend: {
        labels: {
          fontFamily: 'Open Sans',
          fontSize: 14,
        }
      },
      animation: {
        duration: 1000,
        easing: 'easeInQuad'
      },
      scales: {
        // We use this empty structure as a placeholder for dynamic theming.
        xAxes: [
          {
            gridLines: {
              color: 'rgba(255,0,0,0.3)',
            },
            ticks: {
              fontColor: 'blue',
              fontSize: 12,
              fontFamily: 'Open Sans',
            }
          }
        ],
        yAxes: [
          {
            position: 'right',
            gridLines: {
              color: 'rgba(255,0,0,0.3)',
            },
            ticks: {
              suggestedMin: 0,
              suggestedMax: 100,
              fontColor: 'blue',
              fontSize: 12,
              fontFamily: 'Open Sans',
            }
          }
        ]
      }
    }
  }
  
  export class animationtype {
    start_time: number; //delayt
    end_time: number;
    anim_type: string;
    duration: number;
    ease: string;
    posx: number;
    posy: number;
    rotationcycle: string;
    travellocX: number;
    travellocY: number;
    scalesize: number;
    skewY: number;
    skewX: number;
    easetype: any;
    fromto: string;
    transformOriginX: string;
    transformOriginY: string;
    repeat: number;
    yoyo: boolean;
    audioeffectsrc: string;
    rotationkeeppos: boolean
  }
  
  export class vectoranimationtype {
    svganimationtype: string;
    drawcolor: string;
    linethickness: string;
    repeat: number;
    yoyo: boolean;
    fillright: string;
    fillleft: string;
    drawright: string;
    drawleft: string;
    start_time: number; //delay
    end_time: number;
    duration: number;
    hideimage: boolean;
    easetype: any;
    fromto: string;
  }
  
  export class splittexttype {
    textanimationtype: string;
    repeat: number;
    start_time: number; //delay
    end_time: number;
    duration: number;
    x: number;
    y: number;
    fromto: string;
    easetype: any;
  }
  
  export class imageanimation {
    type: 'image';
    groupmember: false;
    style: {
      'z-index': number,
      width: string;
      height: string;
      position: 'absolute';
      opacity: 1;
      'clip-path': string;
      'box-shadow': string;
    };
    clippath: string;
    src: string;
    posx: number;
    posy: number;
    setpos: object;
    id: string;
    animation: animationtype[];
    motionpath: string;
    transform: string;
    motionrotation: number;
    rotation: number;
    grey: false;
    blur: false;
  }
  
  export class vectorcombinator {
    type: 'vectorcombi';
    groupname: string;
    groupmember: false;
    vectors: vectoranimation[];
    animation: animationtype[];
    style: {
      'z-index': number,
      width: string;
      height: string;
      position: 'absolute';
      opacity: 1;
    }
    posx: number;
    posy: number;
    setpos: object;
    id: string;
    motionpath: string;
    transform: string;
    motionrotation: number;
    rotation: number;
  }
  
  export class vectoranimation {
    groupmember: false;
    type: 'vector';
    style: {
      'z-index': number,
      width: string;
      height: string;
      position: 'absolute';
      opacity: 1;
      'stroke-width': string;
      stroke: string;
      'box-shadow': string;
    };
    src: string;
    posx: number;
    posy: number;
    setpos: object;
    id: string;
    animation: animationtype[];
    vectors: vectorelement[];
    vectoranimation: vectoranimationtype[];
    svgcombi: string;
    selected: boolean;
    morph: boolean;
    motionpath: string;
    transform: string;
    motionrotation: number;
    rotation: number;
  }
  
  export class vectorelement {
    idx: string;
    src: string;
    object: string;
    duration: number;
    start_time: number;
    pathids: string[];
    easetype: any;
    fromto: string;
    scale: number;
  }
  
  export class shapeanimation {
    type: 'shape';
    groupmember: false;
    style: {
      'z-index': number,
      width: string;
      height: string;
      position: 'absolute';
      'background-color': string;
      opacity: 1;
      'border-radius': string;
      class: string;
      'box-shadow': string;
    };
    src: string;
    posx: number;
    posy: number;
    setpos: object;
    id: string;
    shape: string;
    animation: animationtype[];
    motionpath: string;
    transform: string;
    motionrotation: number;
    rotation: number;
  }
  
  export class textanimation {
    content: string;
    groupmember: false;
    type: 'text';
    style: {
      'z-index': number,
      width: string;
      height: string;
      position: 'absolute';
      'font-size': string;
      'font-style': string;
      'font-weight': string;
      'font-family': string;
      padding: string;
      opacity: 1;
      'box-shadow': string;
    }
    posx: number;
    posy: number;
    setpos: object;
    id: string;
    splittextanimation: splittexttype[];
    animation: animationtype[];
    motionpath: string;
    transform: string;
    motionrotation: number;
    rotation: number;
  }