import { AddressesContent } from './addresses-content'
import { AssetContent } from './asset-content'
import { AuthLogContent } from './auth-log-content'
import { BankDepositContent } from './bank-deposit-content'
import { BankWithdrawContent } from './bank-withdraw-content'
import { ChangesLogContent } from './changes-log-content'
import { DepositContent } from './deposit-content'
import { InternalDepositContent } from './internal-deposit-content'
import { InternalWithdrawContent } from './internal-withdraw-content'
import { OrdersContent } from './orders-content'
import { P2POrdersContent } from './p2p-orders-content'
import { SecurityContent } from './security-content'
import { WithdrawBanContent } from './withdraw-ban-content'
import { WithdrawContent } from './withdraw-content'

type UserDetailSelectContentProps = {
  selectedOption: string
  userId: string
}

export function UserDetailSelectContent({
  selectedOption,
  userId,
}: UserDetailSelectContentProps) {
  const renderContent = () => {
    switch (selectedOption) {
      case 'Asset':
        return <AssetContent userId={userId} />
      case 'Internal Deposit':
        return <InternalDepositContent userId={userId} />
      case 'Internal Withdraw':
        return <InternalWithdrawContent userId={userId} />
      case 'Bank Deposit':
        return <BankDepositContent userId={userId} />
      case 'Bank Withdraw':
        return <BankWithdrawContent userId={userId} />
      case 'Deposit':
        return <DepositContent userId={userId} />
      case 'Withdraw':
        return <WithdrawContent userId={userId} />
      case 'P2P orders':
        return <P2POrdersContent userId={userId} />
      case 'Security':
        return <SecurityContent userId={userId} />
      case 'Orders':
        return <OrdersContent userId={userId} />
      case 'Addresses':
        return <AddressesContent userId={userId} />
      case 'Auth Log':
        return <AuthLogContent userId={userId} />
      case 'Changes Log':
        return <ChangesLogContent userId={userId} />
      case 'Withdraw Ban':
        return <WithdrawBanContent userId={userId} />
      default:
        return (
          <div className='bg-card rounded-lg border p-6'>
            <div className='text-muted-foreground py-8 text-center'>
              Select an option to view content
            </div>
          </div>
        )
    }
  }

  return <div>{renderContent()}</div>
}
