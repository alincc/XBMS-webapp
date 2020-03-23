import { BrowserModule, HammerModule } from '@angular/platform-browser';
import { NgModule, Injectable } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { Routes, RouterModule } from '@angular/router';
import { ServiceWorkerModule, SwUpdate } from '@angular/service-worker'; 
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';

import { MatTableModule } from '@angular/material/table';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatIconModule} from '@angular/material/icon';
import { MatExpansionModule} from '@angular/material/expansion';
import { MatListModule} from '@angular/material/list';
import { MatSlideToggleModule} from '@angular/material/slide-toggle';
import { MatSliderModule } from '@angular/material/slider';
import { MatBadgeModule } from '@angular/material/badge';
//import { GestureConfig } from '@angular/material/';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatChipsModule } from '@angular/material/chips';
import { MatStepperModule } from '@angular/material/stepper';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatDialogRef } from '@angular/material/dialog';
import { DragDropModule } from '@angular/cdk/drag-drop';

import { HttpClientModule } from '@angular/common/http';
import { AppComponent, BottomSheetLogOverview } from './app.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SDKBrowserModule } from './shared/sdk/index';
import { SpeechRecognitionService } from './shared/speechservice/speechservice';
import { AuthGuard } from './shared/auth.guard';
//import 'hammerjs';

import { codesnippetService, CodesnippetDialog } from './dialogsservice/codesnippet-dialog.component';
import { RandomService } from './dialogsservice/random.service';
import { DialogsService } from './dialogsservice/dialogs.service';
import { RandomDialog } from './dialogsservice/random-dialog.component';
import { DialogGetname } from './dialogsservice/dialog.getname';
import { WordpressUploadDialogComponent } from './dialogsservice/wordpressupload-dialog.component';
import { FileUploadModule } from 'ng2-file-upload';
import { PickerModule } from '@ctrl/ngx-emoji-mart'
import { SpeedDialFabComponent } from './shared/speed-dial-fab/speed-dial-fab.component'

import { ChartsModule } from 'ng2-charts';
import { AgmCoreModule } from '@agm/core';
import { WordpressService } from './shared/websiteservice/';
import { LinkedinService } from './shared/socialservice/';



import { XlsxFileUploadComponent } from './marketing/xlsx-file-upload/xlsx-file-upload.component';
import { GoogleMapService } from './shared/googlemapservice/googlemap.service'
import { timeconv } from './shared/timeconv'
import { CKEditorModule } from 'ng2-ckeditor';
import { IconService } from '../assets/icons/icon.service';
import { environment } from '../environments/environment';
import { MaileditorText } from './marketing/maileditor/maileditormodel/maileditormodels'
import { FlexLayoutModule } from '@angular/flex-layout';
import { GooglePlacesDirective } from './google-places.directive';
import { ReturnpageComponent } from './returnpage/returnpage.component';
import { MarketingchannelsComponent } from './marketing/marketingchannels/marketingchannels.component';
import { PwaService } from './pwa.service';
import { MaileditorComponent } from './marketing/maileditor/maileditor.component';
import { TextEditorDialog } from './marketing/maileditor/texteditordialog.component';
import { ColorPickerModule } from 'ngx-color-picker';


import { SafeHtml } from './pipe/safehtmlpipe.component';
import { SafePipe } from './pipe/safepipe.component';
import { FileName } from './pipe/filenamepipe.component';

import { MarketingplannerComponent } from './marketingplanner/marketingplanner.component';
import { MarketingpromotionsComponent } from './marketing/marketingpromotions/marketingpromotions.component';
import { MarketingpublicationsComponent } from './marketing/marketingpublications/marketingpublications.component';
import { VideocreatorComponent } from './marketing/videocreator/videocreator.component';
import { ImagecreatorComponent } from './marketing/imagecreator/imagecreator.component';
import { FileuploadComponent, dialoggallerycomponent } from './shared/fileupload/fileupload.component';
import { RelationComponent } from './relation/relation.component';
import { MarketingComponent } from './marketing/marketing.component';
import { SettingsComponent } from './settings/settings.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { LoginComponent } from './login/login.component';
import { ConfirmDialog } from './dialogsservice/confirm-dialog.component';

import { VideouploadComponent, dialogvideogallerycomponent } from './shared/videoupload/videoupload.component';
import { AudiouploadComponent, dialogaudiogallerycomponent } from './shared/audioupload/audioupload.component';
//import { FileserverComponent } from './shared/fileserver/fileserver.component';
import { LinkedinComponent } from './shared/linkedin/linkedin.component';

import { AngularDraggableModule } from 'angular2-draggable';
import { MatBottomSheetModule } from '@angular/material/bottom-sheet';
import { HammerGestureConfig, HAMMER_GESTURE_CONFIG } from '@angular/platform-browser';
import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';

import { InlineSVGModule } from 'ng-inline-svg';
import { CanvasWhiteboardModule } from 'ng2-canvas-whiteboard';

import { VectoruploadComponent, dialogvectorgallerycomponent } from './shared/vectorupload/vectorupload.component';
import { BackgroundComponent, dialogbackgroundgallerycomponent } from './shared/background/background.component';
import { TranslationsComponent } from './translations/translations.component';
import { MatPasswordStrengthModule } from '@angular-material-extensions/password-strength';
import {SpecialCharacterDirective } from './directives/specialcharacter.directive';
import {GestureConfig} from '@angular/material/core';
import { TableComponent } from './dashboard/table/table.component';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatSortModule} from '@angular/material/sort';

//disable pinch and rotate to scroll swip check the hammerjs doc for future fix
export class CustomHammerConfig extends HammerGestureConfig  {
  overrides = <any>{
      'pinch': { enable: false },
      'rotate': { enable: false }
  }
}

// declare var Hammer: any;
// @Injectable()
// export class HammerConfig extends GestureConfig {
//   buildHammer(element: HTMLElement) {
//     return new GestureConfig({ touchAction: 'pan-y' }).buildHammer(element);
//   }
//   overrides = <any>{
//     'pinch': { enable: false },
//     'rotate': { enable: false }
//   }
// }

@NgModule({
  declarations: [
    SpecialCharacterDirective,
    SpeedDialFabComponent,
    XlsxFileUploadComponent,
    BottomSheetLogOverview,
    AppComponent,
    RelationComponent,
    MarketingComponent,
    SettingsComponent,
    DashboardComponent,
    LoginComponent,
    ConfirmDialog,
    CodesnippetDialog,
    RandomDialog,
    DialogGetname,
    MarketingplannerComponent,
    //FileserverComponent,
    LinkedinComponent,
    GooglePlacesDirective,
    ReturnpageComponent,
    MarketingchannelsComponent,
    MaileditorComponent,
    FileuploadComponent,
    dialoggallerycomponent,
    dialogvideogallerycomponent,
    dialogaudiogallerycomponent,
    dialogvectorgallerycomponent,
    dialogbackgroundgallerycomponent,
    TextEditorDialog,
    WordpressUploadDialogComponent,
    SafeHtml,
    SafePipe,
    FileName,
    MarketingpromotionsComponent,
    MarketingpublicationsComponent,
    ImagecreatorComponent,
    VideouploadComponent,
    AudiouploadComponent,
    VideocreatorComponent,
    VectoruploadComponent,
    BackgroundComponent,
    TranslationsComponent,
    TableComponent
  ],

  entryComponents: [
    BottomSheetLogOverview,
    dialoggallerycomponent,
    dialogvideogallerycomponent,
    dialogaudiogallerycomponent,
    dialogvectorgallerycomponent,
    dialogbackgroundgallerycomponent,
    CodesnippetDialog,
    ConfirmDialog,
    TextEditorDialog,
    RandomDialog,
    DialogGetname,
    WordpressUploadDialogComponent
  ],

  imports: [
    MatSortModule,
    MatPaginatorModule,
    HammerModule,
    MatPasswordStrengthModule.forRoot(),
    CanvasWhiteboardModule,
    InlineSVGModule,
    BrowserModule,
    BrowserAnimationsModule,
    MatBottomSheetModule,
    PickerModule,
    ColorPickerModule,
    FlexLayoutModule,
    CKEditorModule,
    FileUploadModule,
    AngularDraggableModule,
    ChartsModule,
    RouterModule,
    AppRoutingModule,
    MatCheckboxModule,
    DragDropModule,
    MatIconModule, 
    MatSnackBarModule,
    MatSidenavModule, 
    MatTooltipModule,
    MatMenuModule, 
    MatSelectModule, 
    MatTabsModule, 
    MatInputModule, 
    MatCardModule, 
    MatToolbarModule,
    //MatNativeDateModule, 
    MatTableModule, 
    MatToolbarModule, 
    MatStepperModule,
    MatButtonModule, 
    MatCheckboxModule, 
    MatSidenavModule, 
    MatDialogModule, 
    MatProgressSpinnerModule,
    MatProgressBarModule, MatAutocompleteModule, MatListModule, MatSliderModule,
    FormsModule, ReactiveFormsModule, HttpClientModule, MatGridListModule, MatSlideToggleModule,
    MatNativeDateModule,
    MatDatepickerModule, MatExpansionModule, MatButtonToggleModule, MatChipsModule, MatBadgeModule,
    //ModalGalleryModule.forRoot(),
    CalendarModule.forRoot({
      provide: DateAdapter,
      useFactory: adapterFactory
    }),
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyA0RsiG74QFKTDJZQ1Cl6kso_iOqnAYjV8',
      libraries: ["places"]
    }),
    SDKBrowserModule.forRoot(),
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production }),
    MatPasswordStrengthModule
  ],
  providers: [
    codesnippetService,
    PwaService,
    SpeechRecognitionService,
    LinkedinService,
    AuthGuard,
    RandomService,
    DialogsService,
    WordpressService,
    GoogleMapService,
    IconService,
    timeconv,
    MarketingchannelsComponent,
    WordpressUploadDialogComponent,
    { provide: MAT_DIALOG_DATA, useValue: {} },
    { provide: MatDialogRef, useValue: {} },
    {
      provide: HAMMER_GESTURE_CONFIG,
      useClass: CustomHammerConfig // HammerConfig
    }
  ],
  bootstrap: [AppComponent],
  exports: [
    ConfirmDialog,
    CodesnippetDialog,
    RandomDialog,
    DialogGetname
  ]
})
export class AppModule { }
