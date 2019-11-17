import { DocumentService } from '../documents';
import { AppEventProxy } from '../event';
import * as monthEvents from '../months/month-events';
import { Month, Summary, MonthTrackingSummary } from '../model';

export class SummaryService {
  constructor(private readonly documentService: DocumentService) {}
  observe(eventProxy: AppEventProxy) {
    eventProxy.on(
      monthEvents.createMonthUpdateEvent,
      ({ user, before, after }) => {
        this.updateSummaryWithChangedMonth(user, { after, before });
      }
    );
  }

  private async updateSummaryWithChangedMonth(
    user: string,
    change: { after: Month; before: Month }
  ) {
    const after = change.after;

    const doc = await this.getSummaryDocument(user);
    const summary = await doc.getData();

    const m = this.getMonthFromSummary(summary, after.uid);
    m.balance = { minutes: 0 };
    after.days
      .map(d => d.reached.minutes - d.target.minutes)
      .forEach(diff => (m.balance.minutes += diff));

    summary.balance.minutes = summary.trackedMonths.reduce(
      (a, b) => a + b.balance.minutes,
      0
    );

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

  private async getSummaryDocument(user: string) {
    return await this.documentService.getOrCreateDocument<Summary>({
      path: `userData`,
      name: user,
      defaultData: { balance: { minutes: 0 }, trackedMonths: [] }
    });
  }
}
