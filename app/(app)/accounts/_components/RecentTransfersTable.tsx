import { formatVnd } from "@/lib/format";
import type { RecentTransferDto } from "@/lib/services/account-service";

export function RecentTransfersTable({ transfers }: { transfers: RecentTransferDto[] }) {
  return (
    <section>
      <div className="mb-md flex items-center justify-between">
        <h3 className="text-headline-md font-bold">Chuyển khoản gần đây</h3>
      </div>

      {transfers.length === 0 ? (
        <p className="rounded-xl border border-outline-variant bg-surface-container p-lg text-center text-body-md text-on-surface-variant">
          Chưa có giao dịch chuyển khoản nào.
        </p>
      ) : (
        <div className="overflow-hidden rounded-xl border border-outline-variant bg-surface-container">
          <table className="w-full text-left">
            <thead className="border-b border-outline-variant">
              <tr>
                <th className="p-md font-label-sm uppercase text-on-surface-variant">Ngày</th>
                <th className="p-md font-label-sm uppercase text-on-surface-variant">Mô tả</th>
                <th className="p-md font-label-sm uppercase text-on-surface-variant">Tài khoản gửi</th>
                <th className="p-md font-label-sm uppercase text-on-surface-variant">Tài khoản nhận</th>
                <th className="p-md text-right font-label-sm uppercase text-on-surface-variant">Số tiền</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant">
              {transfers.map((t) => (
                <tr key={t.id} className="transition-colors hover:bg-surface-container-high">
                  <td className="p-md font-body-md">{new Intl.DateTimeFormat("vi-VN").format(t.transaction_date)}</td>
                  <td className="p-md font-body-md">{t.note ?? "Chuyển khoản nội bộ"}</td>
                  <td className="p-md font-body-md">{t.from_account_name}</td>
                  <td className="p-md font-body-md">{t.to_account_name}</td>
                  <td className="p-md text-right font-numeric-lg text-body-md text-on-surface">{formatVnd(t.amount)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
