import { Component, ViewChild } from '@angular/core';
import { Nav, Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { AppHelperProvider } from './providers/app-helper';
import { LibraryPage } from '../pages/library/library';
import { SharebookPage } from '../pages/sharebook/sharebook';
import { ProfilePage } from '../pages/profile/profile';
import { FirebaseAuthUser, DatabaseUser } from './models/user';

@Component({
  selector: 'app-component',
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any = 'LibraryPage';
  pages: Array<{ title: string, iconName:string, component: any }>;
  user: FirebaseAuthUser
  menuItemSelected: string = ''
  constructor(public platform: Platform,
    public statusBar: StatusBar,
    public splashScreen: SplashScreen,
    public apphelper: AppHelperProvider
  ) {
    this.initializeApp();
    // used for an example of ngFor and navigation
    this.pages = [
      { title: 'Library', iconName: 'albums', component: 'LibraryPage' },
      { title: 'Sharebook', iconName: 'share-alt', component: 'SharebookPage' },
      { title: 'Profile', iconName: 'person', component: 'ProfilePage' }
    ];
    this.menuItemSelected = 'Library';

  }

  initializeApp() {
    /*
    Check if user is logged in.
    */
    this.apphelper.getCurrentFireAuthUser().then((user:FirebaseAuthUser) => {
      this.user = user;
      console.log(this.user, 'here is promise data')
    })
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }

  openPage(page) {
    this.menuItemSelected = page.title;
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(page.component);
  }

  loginWithGooglePopup() {
    this.apphelper.loginWithGooglePopup().then((user: DatabaseUser) => {
      this.apphelper.getCurrentFireAuthUser().then((authUser:FirebaseAuthUser)=>{
        this.user = authUser;
        this.apphelper.doesUserExist(authUser).then((res:boolean)=>{
          if(!res){
            console.log('user does not exist..creating user');
            this.apphelper.createUserInFirebase(user, authUser).then(res=>{
              console.log(res)
            })
          }
        })
      })
    }).catch(err => {
      console.log(err)
    })
  }
  logout() {
    this.user = null;
    this.apphelper.logout();
  }
}
