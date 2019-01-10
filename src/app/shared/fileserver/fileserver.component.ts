import { Component, OnInit, OnDestroy} from '@angular/core';
import {
  LoopBackConfig,
  BASE_URL,
  API_VERSION,
  Container,
  ContainerApi,
  RelationsApi,
  Files
} from '../';
import { Router, ActivatedRoute } from '@angular/router';
import {
    ButtonEvent,
    ButtonsConfig,
    ButtonsStrategy,
    ButtonType,
    Description,
    DescriptionStrategy,
    DotsConfig,
    GalleryService,
    GridLayout,
    Image,
    ImageModalEvent,
    LineLayout,
    PlainGalleryConfig,
    PlainGalleryStrategy,
    PreviewConfig
  } from '@ks89/angular-modal-gallery'



@Component({
  selector: 'fileserver',
  templateUrl: './fileserver.component.html',
  styleUrls: ['./fileserver.component.scss']
})

    export class FileserverComponent implements OnInit, OnDestroy {
        id: number;
        private sub: any;
        public Files: Files[];
        public Container: Container[];
        public buttonsConfig: ButtonsConfig;
        public buttonEvent; ButtonEvent;
        public buttonsConfigFull: ButtonsConfig;
        public PlainGalleryConfig: PlainGalleryConfig;
        //public images = [];
        //public modalImage;
      
        constructor(
            public router: Router,
            private ContainerApi: ContainerApi,
            private RelationsApi: RelationsApi,
            private route: ActivatedRoute) {
                LoopBackConfig.setBaseURL(BASE_URL);
                LoopBackConfig.setApiVersion(API_VERSION);
            }

            images: Image[] = [];
            imagesNew: Image[] = [];
            
      
        ngOnInit() {
          console.log(this.router.url);
          this.sub = this.route.params.subscribe(params => {
             this.id = params['id'];  //get parameters from url
          });
          //set button config
          
          //this.buttonsConfig =  {visible: true, strategy: ButtonsStrategy.DEFAULT};
          this.buttonsConfig = {
            visible: true,
            strategy: ButtonsStrategy.SIMPLE
          };

          this.PlainGalleryConfig = {
            strategy: PlainGalleryStrategy.GRID,
            layout: new GridLayout({ width: '100px', height: '100px' }, { length: 4, wrap: true })
          };

          //set images array
          this.ContainerApi.getFiles(this.id).subscribe((Files: Files[]) => 
          {this.Files = Files,
          this.Files.forEach((file, index) => { 
            //console.log(file, index);
            let modalImage = {img: BASE_URL + "/api/Containers/" + this.id + "/download/" + file.name};
            let modal = new Image(index, modalImage, null )
            this.imagesNew.push(modal)
          }),
          this.images = this.imagesNew;
        });
        }

        onButtonAfterHook(event: ButtonEvent) {
          if (!event || !event.button) {
            return;
          } 
          // Invoked after a click on a button, but before that the related
          // action is applied.
          // For instance: this method will be invoked after a click
          // of 'close' button, but before that the modal gallery
          // will be really closed.
        if (event.button.type === ButtonType.DOWNLOAD) {
            // remove the current image and reassign all other to the array of images
            // You must think in a functional way! So, re-assign the array instead of modifying it.
            //this.images = this.images.filter((val: Image) => event.image && val.id !== event.image.id);
          console.log(event.image);
          this.onSelectImage(event.image);
            }
        }

        onSelectImage(SelectedImage): void {
          console.log("select image", SelectedImage)
            var funcNum = this.getUrlParam( 'CKEditorFuncNum' );
            var fileUrl = SelectedImage.modal.img;
            window.opener.CKEDITOR.tools.callFunction( funcNum, fileUrl );
            window.close();
        }

        //https://docs.ckeditor.com/ckeditor4/latest/guide/dev_file_browser_api.html
        getUrlParam( paramName ) {
            var reParam = new RegExp( '(?:[\?&]|&)' + paramName + '=([^&]+)', 'i' );
            var match = window.location.search.match( reParam );

            return ( match && match.length > 1 ) ? match[1] : null;
        }

        //close tab
      
        ngOnDestroy() {
          this.sub.unsubscribe();
        }
      

  
}