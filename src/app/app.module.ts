import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { ContainerComponent } from './components/container/container.component';
import { CustomButtonComponent } from './components/custom-button/custom-button.component';
import { BoardComponent } from './components/board/board.component';
import { HistoryComponent } from './components/history/history.component';
import { AppRoutingModule } from './app-routing.module';
import { AboutComponent } from './components/about/about.component';
import { ErrorPageComponent } from './components/error-page/error-page.component';
import { HighlightDirective } from './directives/highlight.directive';

@NgModule({
  declarations: [
    AppComponent,
    ContainerComponent,
    CustomButtonComponent,
    BoardComponent,
    HistoryComponent,
    AboutComponent,
    ErrorPageComponent,
    HighlightDirective,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
