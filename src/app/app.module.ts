import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { ContainerComponent } from './components/container/container.component';
import { CustomButtonComponent } from './components/custom-button/custom-button.component';
import { BoardComponent } from './components/board/board.component';
import { HistoryComponent } from './components/history/history.component';

@NgModule({
  declarations: [
    AppComponent,
    ContainerComponent,
    CustomButtonComponent,
    BoardComponent,
    HistoryComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
