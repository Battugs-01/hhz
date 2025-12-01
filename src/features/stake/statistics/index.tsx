import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { stakeService } from '@/services'
import { BarChart3, Eye, PieChart as PieChartIcon } from 'lucide-react'
import {
  Bar,
  BarChart,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { TableHeader } from '@/components/data-table'
import { Main } from '@/components/layout/main'
import { QUERY_KEYS } from './components/constants'

// Custom Tooltip Component
const CustomTooltip = (props: any) => {
  const { active, payload } = props
  if (active && payload && payload.length) {
    const data = payload[0]
    return (
      <div className='bg-background rounded-lg border p-2 shadow-sm'>
        <div className='grid gap-2'>
          <div className='flex items-center gap-2'>
            <div className='bg-primary h-2.5 w-2.5 rounded-full' />
            <span className='text-sm font-medium'>{data.name}</span>
          </div>
          <div className='text-sm font-bold'>
            {(data.value ?? 0).toLocaleString()}
          </div>
        </div>
      </div>
    )
  }
  return null
}

export function StakeStatistics() {
  const [showDetails, setShowDetails] = useState(false)
  const [chartType, setChartType] = useState<'bar' | 'pie'>('bar')
  const { data, isLoading, error } = useQuery({
    queryKey: [QUERY_KEYS.TOTAL_STAKES_INFO],
    queryFn: async () => {
      const res = await stakeService.getTotalUsersStakesInfo()
      return res.body
    },
    retry: 1,
    throwOnError: false,
  })

  if (error) {
    return (
      <Main className='flex flex-1 flex-col gap-4 sm:gap-6'>
        <TableHeader
          title='Stake Statistics'
          description='View total staking statistics and status breakdown'
        />
        <Card>
          <CardContent className='pt-6'>
            <div className='text-muted-foreground text-center'>
              Failed to load statistics. Please try again.
            </div>
          </CardContent>
        </Card>
      </Main>
    )
  }

  // Prepare chart data from status - show all statuses even if 0
  const chartData = data?.status
    ? [
        {
          name: 'Redeemable',
          value: data.status.redeemable ?? 0,
        },
        {
          name: 'Ongoing',
          value: data.status.ongoing ?? 0,
        },
        {
          name: 'Cancelled',
          value: data.status.cancelled ?? 0,
        },
        {
          name: 'Redeeming',
          value: data.status.redeeming ?? 0,
        },
        {
          name: 'Canceling',
          value: data.status.canceling ?? 0,
        },
        {
          name: 'Cancel Requested',
          value: data.status.cancel_requested ?? 0,
        },
        {
          name: 'Cancel Requested Manual',
          value: data.status.cancel_requested_manual ?? 0,
        },
        {
          name: 'Redeem Requested',
          value: data.status.redeem_requested ?? 0,
        },
        {
          name: 'Redeem Requested Manual',
          value: data.status.redeem_requested_manual ?? 0,
        },
      ]
    : []

  // Calculate total from status values
  const totalFromStatus = chartData.reduce((sum, item) => sum + item.value, 0)

  return (
    <Main className='flex flex-1 flex-col gap-4 sm:gap-6'>
      <TableHeader
        title='Stake Statistics'
        description='View total staking statistics and status breakdown'
      />

      {isLoading ? (
        <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className='h-5 w-32' />
                <Skeleton className='h-4 w-24' />
              </CardHeader>
              <CardContent>
                <Skeleton className='h-8 w-20' />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <>
          {/* Summary Cards */}
          <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-3'>
            <Card>
              <CardHeader>
                <div className='flex items-center justify-between'>
                  <div>
                    <CardTitle>Total Stakes</CardTitle>
                    <CardDescription>All user stakes</CardDescription>
                  </div>
                  <Button
                    type='button'
                    variant='ghost'
                    size='sm'
                    onClick={() => setShowDetails(!showDetails)}
                    className='h-8 w-8 p-0'
                  >
                    <Eye className='h-4 w-4' />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className='text-3xl font-bold'>
                  {totalFromStatus || (data?.total ?? 0)}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Active</CardTitle>
                <CardDescription>Currently active stakes</CardDescription>
              </CardHeader>
              <CardContent>
                <div className='text-3xl font-bold'>
                  {data?.general?.active ?? 0}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Failed</CardTitle>
                <CardDescription>Failed stakes</CardDescription>
              </CardHeader>
              <CardContent>
                <div className='text-3xl font-bold'>
                  {data?.general?.failed ?? 0}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Status Cards - Show when showDetails is true */}
          {showDetails && (
            <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
              {chartData.map((status) => (
                <Card key={status.name}>
                  <CardHeader>
                    <CardTitle className='text-base'>{status.name}</CardTitle>
                    <CardDescription>Status count</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className='text-3xl font-bold'>
                      {status.value.toLocaleString()}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Status Breakdown Chart */}
          <Card>
            <CardHeader>
              <div className='flex items-center justify-between'>
                <div>
                  <CardTitle>Status Breakdown</CardTitle>
                  <CardDescription>
                    Distribution of stakes by status
                  </CardDescription>
                </div>
                <Button
                  type='button'
                  variant='ghost'
                  size='sm'
                  onClick={() =>
                    setChartType(chartType === 'bar' ? 'pie' : 'bar')
                  }
                  className='h-8 w-8 p-0'
                  title={`Switch to ${chartType === 'bar' ? 'Pie' : 'Bar'} Chart`}
                >
                  {chartType === 'bar' ? (
                    <PieChartIcon className='h-4 w-4' />
                  ) : (
                    <BarChart3 className='h-4 w-4' />
                  )}
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {chartData.length > 0 ? (
                <ResponsiveContainer width='100%' height={300}>
                  {chartType === 'bar' ? (
                    <BarChart data={chartData}>
                      <XAxis
                        dataKey='name'
                        stroke='#888888'
                        fontSize={12}
                        tickLine={false}
                        axisLine={false}
                        angle={-45}
                        textAnchor='end'
                        height={80}
                      />
                      <YAxis
                        stroke='#888888'
                        fontSize={12}
                        tickLine={false}
                        axisLine={false}
                      />
                      <Tooltip
                        content={<CustomTooltip />}
                        contentStyle={{
                          backgroundColor: 'transparent',
                          border: 'none',
                          boxShadow: 'none',
                        }}
                        wrapperStyle={{
                          outline: 'none',
                        }}
                        cursor={{ fill: 'transparent' }}
                      />
                      <Bar dataKey='value' radius={[4, 4, 0, 0]}>
                        {chartData.map((_, index) => {
                          // Colorful palette that works well in both light and dark themes
                          const colors = [
                            '#3b82f6', // Blue
                            '#10b981', // Green
                            '#f59e0b', // Amber
                            '#ef4444', // Red
                            '#8b5cf6', // Purple
                            '#06b6d4', // Cyan
                            '#f97316', // Orange
                            '#ec4899', // Pink
                            '#6366f1', // Indigo
                          ]
                          return (
                            <Cell
                              key={`cell-${index}`}
                              fill={colors[index % colors.length]}
                            />
                          )
                        })}
                      </Bar>
                    </BarChart>
                  ) : (
                    <PieChart>
                      <Pie
                        data={chartData}
                        cx='50%'
                        cy='50%'
                        labelLine={false}
                        label={(props: any) => {
                          const { name, percent, value } = props
                          // Only show label if value > 0 and percent > 5% to avoid clutter
                          if (value === 0 || percent < 0.05) {
                            return null
                          }
                          return (
                            <g>
                              <text
                                x={props.x}
                                y={props.y}
                                textAnchor={props.textAnchor}
                                fontSize={12}
                                fontWeight={600}
                                fill='#ffffff'
                                stroke='#000000'
                                strokeWidth={0.5}
                                strokeOpacity={0.8}
                                paintOrder='stroke'
                              >
                                {`${name}: ${(percent * 100).toFixed(0)}%`}
                              </text>
                            </g>
                          )
                        }}
                        outerRadius={100}
                        fill='#8884d8'
                        dataKey='value'
                      >
                        {chartData.map((_, index) => {
                          // Colorful palette that works well in both light and dark themes
                          const colors = [
                            '#3b82f6', // Blue
                            '#10b981', // Green
                            '#f59e0b', // Amber
                            '#ef4444', // Red
                            '#8b5cf6', // Purple
                            '#06b6d4', // Cyan
                            '#f97316', // Orange
                            '#ec4899', // Pink
                            '#6366f1', // Indigo
                          ]
                          return (
                            <Cell
                              key={`cell-${index}`}
                              fill={colors[index % colors.length]}
                            />
                          )
                        })}
                      </Pie>
                      <Tooltip
                        content={<CustomTooltip />}
                        contentStyle={{
                          backgroundColor: 'transparent',
                          border: 'none',
                          boxShadow: 'none',
                        }}
                        wrapperStyle={{
                          outline: 'none',
                        }}
                      />
                      <Legend
                        wrapperStyle={{
                          fontSize: '12px',
                          color: 'hsl(var(--foreground))',
                        }}
                      />
                    </PieChart>
                  )}
                </ResponsiveContainer>
              ) : (
                <div className='text-muted-foreground flex h-[300px] items-center justify-center'>
                  No status data available
                </div>
              )}
            </CardContent>
          </Card>
        </>
      )}
    </Main>
  )
}
