import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { RouterOutlet } from '@angular/router';


@Component({
  selector: 'app-patience',
  templateUrl: './patience.component.html',
  styleUrls: ['./patience.component.scss'],
  encapsulation  : ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone     : true,
  imports        : [RouterOutlet],
})
export class PatienceComponent {
  /**
     * Constructor
     */
    constructor()
    {
    }
}

