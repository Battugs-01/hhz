import { type Coin, type Network } from '@/services'
import {
  Calendar,
  CheckCircle2,
  Coins,
  Hash,
  Image as ImageIcon,
  Network as NetworkIcon,
  XCircle,
} from 'lucide-react'
import { formatDate } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { DetailCard } from '@/components/detail-card'
import type { DetailField } from '@/components/detail-field'

type CoinDetailContentProps = {
  coin: Coin
}

export function CoinDetailContent({ coin }: CoinDetailContentProps) {
  const basicFields: DetailField[] = [
    {
      label: 'ID',
      value: coin.id,
      icon: <Hash className='h-4 w-4' />,
      mask: true,
      copy: true,
    },
    {
      label: 'Symbol',
      value: coin.coin,
      icon: <Coins className='h-4 w-4' />,
      badge: true,
    },
    {
      label: 'Name',
      value: coin.name,
      icon: <Coins className='h-4 w-4' />,
    },
    {
      label: 'Image',
      value: coin.image || '-',
      icon: <ImageIcon className='h-4 w-4' />,
    },
    {
      label: 'Enabled',
      value: coin.isEnabled === 1 ? 'Yes' : 'No',
      icon:
        coin.isEnabled === 1 ? (
          <CheckCircle2 className='h-4 w-4' />
        ) : (
          <XCircle className='h-4 w-4' />
        ),
      badge: true,
      badgeVariant: coin.isEnabled === 1 ? 'success' : 'error',
    },
    {
      label: 'Featured',
      value: coin.isFeatured === 1 ? 'Yes' : 'No',
      icon:
        coin.isFeatured === 1 ? (
          <CheckCircle2 className='h-4 w-4' />
        ) : (
          <XCircle className='h-4 w-4' />
        ),
      badge: true,
      badgeVariant: coin.isFeatured === 1 ? 'success' : 'outline',
    },
    {
      label: 'Trading',
      value: coin.trading ? 'Enabled' : 'Disabled',
      icon: coin.trading ? (
        <CheckCircle2 className='h-4 w-4' />
      ) : (
        <XCircle className='h-4 w-4' />
      ),
      badge: true,
      badgeVariant: coin.trading ? 'success' : 'error',
    },
    {
      label: 'Deposit All Enable',
      value: coin.depositAllEnable ? 'Enabled' : 'Disabled',
      icon: coin.depositAllEnable ? (
        <CheckCircle2 className='h-4 w-4' />
      ) : (
        <XCircle className='h-4 w-4' />
      ),
      badge: true,
      badgeVariant: coin.depositAllEnable ? 'success' : 'error',
    },
    {
      label: 'Withdraw All Enable',
      value: coin.withdrawAllEnable ? 'Enabled' : 'Disabled',
      icon: coin.withdrawAllEnable ? (
        <CheckCircle2 className='h-4 w-4' />
      ) : (
        <XCircle className='h-4 w-4' />
      ),
      badge: true,
      badgeVariant: coin.withdrawAllEnable ? 'success' : 'error',
    },
    {
      label: 'Legal Money',
      value: coin.isLegalMoney ? 'Yes' : 'No',
      icon: coin.isLegalMoney ? (
        <CheckCircle2 className='h-4 w-4' />
      ) : (
        <XCircle className='h-4 w-4' />
      ),
      badge: true,
      badgeVariant: coin.isLegalMoney ? 'success' : 'outline',
    },
  ]

  const metadataFields: DetailField[] = [
    {
      label: 'Created At',
      value: formatDate(coin.created_at),
      icon: <Calendar className='h-4 w-4' />,
    },
    {
      label: 'Updated At',
      value: formatDate(coin.updated_at),
      icon: <Calendar className='h-4 w-4' />,
    },
  ]

  const renderNetworkRow = (network: Network, index: number) => (
    <TableRow key={index}>
      <TableCell className='font-medium'>{network.network || '-'}</TableCell>
      <TableCell>{network.name || '-'}</TableCell>
      <TableCell>
        <Badge variant={network.depositEnable ? 'success' : 'error'}>
          {network.depositEnable ? 'Enabled' : 'Disabled'}
        </Badge>
      </TableCell>
      <TableCell>
        <Badge variant={network.withdrawEnable ? 'success' : 'error'}>
          {network.withdrawEnable ? 'Enabled' : 'Disabled'}
        </Badge>
      </TableCell>
      <TableCell>
        {network.isDefault ? (
          <Badge variant='success'>Yes</Badge>
        ) : (
          <Badge variant='outline'>No</Badge>
        )}
      </TableCell>
      <TableCell>{network.withdrawFee || '-'}</TableCell>
      <TableCell>{network.withdrawMin || '-'}</TableCell>
      <TableCell>{network.withdrawMax || '-'}</TableCell>
      <TableCell>
        {network.minConfirm !== undefined && network.minConfirm !== null
          ? String(network.minConfirm)
          : '-'}
      </TableCell>
      <TableCell>
        {network.estimatedArrivalTime !== undefined &&
        network.estimatedArrivalTime !== null
          ? `${network.estimatedArrivalTime} min`
          : '-'}
      </TableCell>
    </TableRow>
  )

  return (
    <div className='space-y-4'>
      {/* Basic Information */}
      <DetailCard title='Basic Information' fields={basicFields} />

      {/* Network List */}
      {coin.networkList && coin.networkList.length > 0 && (
        <div className='bg-card text-card-foreground rounded-lg border shadow-sm'>
          <div className='flex flex-col space-y-1.5 border-b p-6'>
            <div className='flex items-center gap-2'>
              <NetworkIcon className='h-5 w-5' />
              <h3 className='text-lg leading-none font-semibold tracking-tight'>
                Network List
              </h3>
              <Badge variant='outline' className='ml-auto'>
                {coin.networkList.length} network(s)
              </Badge>
            </div>
          </div>
          <div className='p-6'>
            <div className='overflow-x-auto'>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Network</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Deposit</TableHead>
                    <TableHead>Withdraw</TableHead>
                    <TableHead>Default</TableHead>
                    <TableHead>Withdraw Fee</TableHead>
                    <TableHead>Withdraw Min</TableHead>
                    <TableHead>Withdraw Max</TableHead>
                    <TableHead>Min Confirm</TableHead>
                    <TableHead>Est. Arrival</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {coin.networkList.map((network, index) =>
                    renderNetworkRow(network, index)
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        </div>
      )}

      {/* Metadata */}
      <DetailCard title='Metadata' fields={metadataFields} />
    </div>
  )
}
