/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { MessagecompComponent } from './messagecomp.component';

describe('MessagecompComponent', () => {
  let component: MessagecompComponent;
  let fixture: ComponentFixture<MessagecompComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MessagecompComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MessagecompComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
