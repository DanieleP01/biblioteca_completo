import { bootstrapApplication } from '@angular/platform-browser';
import { RouteReuseStrategy, provideRouter, withPreloading, PreloadAllModules } from '@angular/router';
import { IonicRouteStrategy, provideIonicAngular } from '@ionic/angular/standalone';

import { routes } from './app/app.routes';
import { AppComponent } from './app/app.component';
import { addIcons } from 'ionicons';
import { 
  personOutline, 
  logInOutline, 
  personAddOutline, 
  lockClosed, 
  menu, 
  libraryOutline, 
  logOutOutline, 
  searchOutline, 
  arrowBack, 
  close, 
  bookOutline, 
  copyOutline, 
  addOutline, 
  listOutline, 
  calendarOutline, 
  alarmOutline, 
  checkmarkCircleOutline, 
  informationCircleOutline, 
  personCircleOutline,
  mailOutline,
  idCardOutline,
  businessOutline,
  mapOutline,
  barcodeOutline,
  archiveOutline,
  timeOutline,
} from 'ionicons/icons';

addIcons({
  'person-outline': personOutline,
  'log-in-outline': logInOutline,
  'personAddOutline': personAddOutline,
  'lock-closed': lockClosed,
  'menu': menu,
  'library-outline': libraryOutline,
  'log-out-outline': logOutOutline,
  'search-outline': searchOutline,
  'arrow-back': arrowBack,
  'close': close,
  'book-outline': bookOutline,
  'copy': copyOutline,
  'add-outline': addOutline,
  'list-outline': listOutline,
  'calendar-outline': calendarOutline,
  'alarm-outline': alarmOutline,
  'checkmark-outline': checkmarkCircleOutline,
  'information-outline': informationCircleOutline,
  'person-circle-outline': personCircleOutline,
  'mail-outline': mailOutline,
  'id-card-outline': idCardOutline,
  'business-outline': businessOutline,
  'map-outline': mapOutline,
  'barcode-outline': barcodeOutline,
  'archive-outline': archiveOutline,
  'time-outline': timeOutline
});

bootstrapApplication(AppComponent, {
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    provideIonicAngular(),
    provideRouter(routes, withPreloading(PreloadAllModules)),
  ],
});
