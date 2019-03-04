import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { Routes, RouterModule } from '@angular/router';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatMenuModule, MatButtonModule, MatCheckboxModule, MatSidenavModule, MatDialogModule, MatDatepickerModule } from '@angular/material';
import { MatSelectModule, MatNativeDateModule, MatTableModule, MatProgressSpinnerModule, MatTabsModule, MatTooltipModule } from '@angular/material';
import { MatInputModule, MatCardModule, MatToolbarModule, MatAutocompleteModule } from '@angular/material';
import { MatIconModule, MatExpansionModule, MatListModule, MatSlideToggleModule } from '@angular/material';
import {MatBadgeModule} from '@angular/material/badge';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import {MatGridListModule} from '@angular/material/grid-list';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatChipsModule } from '@angular/material/chips';

import { HttpClientModule } from '@angular/common/http';
import { AppComponent } from './app.component';
import { RelationComponent } from './relation/relation.component';
import { MarketingComponent } from './marketing/marketing.component';
import { SettingsComponent } from './settings/settings.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SDKBrowserModule } from './shared/sdk/index';
import { FileserverComponent } from './shared/fileserver/fileserver.component';
import { LinkedinComponent } from './shared/linkedin/linkedin.component';
import { SpeechRecognitionService } from './shared/speechservice/speechservice';

import { AuthGuard } from './shared/auth.guard';
import 'hammerjs';
import { LoginComponent } from './login/login.component';
import { ConfirmDialog } from './dialogsservice/confirm-dialog.component';
import { RandomService } from './dialogsservice/random.service';
import { DialogsService } from './dialogsservice/dialogs.service';
import { RandomDialog } from './dialogsservice/random-dialog.component';
import { FileUploadModule } from 'ng2-file-upload';

import { ChartsModule } from 'ng2-charts';
import { AgmCoreModule } from '@agm/core';
import { WordpressService } from './shared/websiteservice/'; 
import { LinkedinService } from './shared/socialservice/';
import { DragulaModule } from 'ng2-dragula';
import { MarketingplannerComponent } from './marketingplanner/marketingplanner.component';
import { MatStepperModule } from '@angular/material/stepper';
import { XlsxFileUploadComponent } from './marketing/xlsx-file-upload/xlsx-file-upload.component';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { GoogleMapService } from './shared/googlemapservice/googlemap.service'
import { timeconv } from './shared/timeconv'
import { CKEditorModule } from 'ng2-ckeditor';
import { IconService } from '../assets/icons/icon.service';
import 'mousetrap';
import { ModalGalleryModule } from '@ks89/angular-modal-gallery';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';

import {FlexLayoutModule} from '@angular/flex-layout';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { GooglePlacesDirective } from './google-places.directive';
import { ReturnpageComponent } from './returnpage/returnpage.component';
import { MarketingchannelsComponent } from './marketing/marketingchannels/marketingchannels.component';
import { PwaService } from './pwa.service';
import { MaileditorComponent } from './marketing/maileditor/maileditor.component';
import {DragDropModule} from '@angular/cdk/drag-drop';
import { MaileditorModel} from './marketing/maileditor/maileditormodel/maileditormodels';
import { ColorPickerModule } from 'ngx-color-picker';
@NgModule({
  declarations: [
    XlsxFileUploadComponent,
    AppComponent,
    RelationComponent,
    MarketingComponent,
    SettingsComponent,
    DashboardComponent,
    LoginComponent,
    ConfirmDialog,
    RandomDialog,
    MarketingplannerComponent,
    FileserverComponent,
    LinkedinComponent,
    GooglePlacesDirective,
    ReturnpageComponent,
    MarketingchannelsComponent,
    MaileditorComponent
  ],

   entryComponents: [
    ConfirmDialog,
    RandomDialog,
  ],

  imports: [
    ColorPickerModule,
    NgxChartsModule,
    FlexLayoutModule,
    CKEditorModule,
    FileUploadModule,
    DragulaModule,
    ChartsModule,
    BrowserModule,
    BrowserAnimationsModule,
    RouterModule,
    AppRoutingModule,
    MatCheckboxModule,
    DragDropModule,
    MatIconModule, MatSnackBarModule,
    MatSidenavModule, MatTooltipModule,
    MatMenuModule, MatSelectModule, MatTabsModule, MatInputModule, MatCardModule, MatToolbarModule,
    MatNativeDateModule, MatTableModule, MatToolbarModule, MatStepperModule,
    MatButtonModule, MatCheckboxModule, MatSidenavModule, MatDialogModule, MatProgressSpinnerModule,
    MatProgressBarModule, MatAutocompleteModule, MatListModule,
    FormsModule, ReactiveFormsModule, HttpClientModule, MatGridListModule, MatSlideToggleModule,
    MatDatepickerModule, MatExpansionModule, MatButtonToggleModule, MatChipsModule, MatBadgeModule,
    ModalGalleryModule.forRoot(),
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyA0RsiG74QFKTDJZQ1Cl6kso_iOqnAYjV8',
      libraries: ["places"]
    }),
    SDKBrowserModule.forRoot(),
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production })
  ],
  providers: [
    PwaService ,
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
    MaileditorModel
  ],
  bootstrap: [AppComponent],
  exports: [
    ConfirmDialog,
    RandomDialog
]
})
export class AppModule { }
