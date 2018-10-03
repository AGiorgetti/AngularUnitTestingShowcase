import { tick, ComponentFixture } from "@angular/core/testing";

/** Wait a tick, then detect changes */
export function advance(f: ComponentFixture<any>): void {
  tick();
  f.detectChanges();
}
