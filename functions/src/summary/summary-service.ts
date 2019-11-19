import { DocumentService } from '../documents';
import { AppEventProxy } from '../event-proxy';
import * as monthEvents from '../months/month-events';
import { Month, Summary, MonthTrackingSummary } from '../model';

export class SummaryService {
  constructor(private readonly documentService: DocumentService) {}
  observe(eventProxy: AppEventProxy) {
    eventProxy.on(
      monthEvents.createMonthUpdateEvent,
      ({ user, before, after }) => {
        return this.updateSummaryWithChangedMonth(user, { after, before });
      }
    );
  }

  private async updateSummaryWithChangedMonth(
    user: string,
    change: { after: Month; before: Month }
  ) {
    const after = change.after;

    const doc = await this.getSummaryDocument(user);
    const exists = await doc.exists();
    const summary: Summary = exists
      ? await doc.getData()
      : { trackedMonths: [] };

    const m = this.getMonthFromSummary(summary, after.uid);

    m.balance = { minutes: 0 };
    after.days
      .map(d => d.reached.minutes - d.target.minutes)
      .forEach(diff => (m.balance.minutes += diff));

    return doc.setData(summary);
  }

  private getMonthFromSummary(
    summary: Summary,
    uid: string
  ): MonthTrackingSummary {
    let month = summary.trackedMonths.find(m => m.uid === uid);
    if (!month) {
      month = { uid, balance: { minutes: 0 } };
      summary.trackedMonths.push(month);
    }
    return month;
  }

  private getSummaryDocument(user: string) {
    return this.documentService.getDocument<Summary>({
      path: 'userData',
      name: user
    });
  }
}
