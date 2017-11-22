/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { GamehandlerComponent } from './gamehandler.component';

describe('GamehandlerComponent', () => {
  let component: GamehandlerComponent;
  let fixture: ComponentFixture<GamehandlerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GamehandlerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GamehandlerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
