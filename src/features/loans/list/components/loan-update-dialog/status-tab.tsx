import { getOverdueStatus } from '@/lib/format-utils'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { DatePicker } from '@/components/ui/date-picker'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { TabsContent } from '@/components/ui/tabs'
import { Textarea } from '@/components/ui/textarea'
import type { StatusTabProps } from './types'

export function StatusTab({
  data,
  selectedStatus,
  setSelectedStatus,
  loanStatuses,
  shouldShowJudgeFields,
  judgeInfo,
  setJudgeInfo,
  districtsData,
  judgeCloseStatuses,
}: StatusTabProps) {
  const overdueStatus = getOverdueStatus(data.overdueDay)

  return (
    <TabsContent value='status' className='mt-0 px-6 py-4'>
      <div className='space-y-4'>
        <h3 className='font-semibold'>Зээлийн төлөв өөрчлөх</h3>

        <div className='bg-muted/30 rounded-lg p-4'>
          <div className='mb-4 flex items-center gap-4'>
            <div className='flex-1'>
              <Label className='text-muted-foreground text-xs'>
                Одоогийн төлөв
              </Label>
              <div className='mt-1'>
                <Badge variant={overdueStatus.variant}>{data.status}</Badge>
              </div>
            </div>
            <div className='flex-1'>
              <Label className='text-muted-foreground text-xs'>
                Хэтэрсэн хоног
              </Label>
              <p className={cn('font-bold', overdueStatus.color)}>
                {data.overdueDay} хоног ({overdueStatus.label})
              </p>
            </div>
          </div>

          <Separator className='my-4' />

          <div className='space-y-3'>
            <Label htmlFor='status'>Шинэ төлөв сонгох</Label>
            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger id='status' className='w-full'>
                <SelectValue placeholder='Төлөв сонгоно уу' />
              </SelectTrigger>
              <SelectContent>
                {loanStatuses?.map((status) => (
                  <SelectItem key={status.id} value={status.id.toString()}>
                    {status.description}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Шүүхийн мэдээлэл - status 1 эсвэл 4 сонгоход харуулна */}
          {shouldShowJudgeFields && (
            <>
              <Separator className='my-4' />
              <h4 className='text-sm font-semibold'>Шүүхийн мэдээлэл</h4>
              <div className='mt-3 grid grid-cols-2 gap-3'>
                <div className='space-y-2'>
                  <Label className='text-xs'>Дүүрэг</Label>
                  <Select
                    value={judgeInfo.district}
                    onValueChange={(v) =>
                      setJudgeInfo({ ...judgeInfo, district: v })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder='Дүүрэг сонгох' />
                    </SelectTrigger>
                    <SelectContent>
                      {districtsData?.map((d) => (
                        <SelectItem key={d.id} value={d.id.toString()}>
                          {d.districtMn}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className='space-y-2'>
                  <Label className='text-xs'>Шүүгч</Label>
                  <Input
                    value={judgeInfo.judge}
                    onChange={(e) =>
                      setJudgeInfo({ ...judgeInfo, judge: e.target.value })
                    }
                    placeholder='Шүүгчийн нэр'
                  />
                </div>
                <div className='space-y-2'>
                  <Label className='text-xs'>Шүүгчийн туслах</Label>
                  <Input
                    value={judgeInfo.judgeAssistant}
                    onChange={(e) =>
                      setJudgeInfo({
                        ...judgeInfo,
                        judgeAssistant: e.target.value,
                      })
                    }
                    placeholder='Туслахын нэр'
                  />
                </div>
                <div className='space-y-2'>
                  <Label className='text-xs'>Туслахын утас</Label>
                  <Input
                    value={judgeInfo.judgeAssistantPhoneNumber}
                    onChange={(e) =>
                      setJudgeInfo({
                        ...judgeInfo,
                        judgeAssistantPhoneNumber: e.target.value,
                      })
                    }
                    placeholder='99001122'
                  />
                </div>
                <div className='space-y-2'>
                  <Label className='text-xs'>Нэхэмжлэлийн дугаар</Label>
                  <Input
                    value={judgeInfo.invoiceNumber}
                    onChange={(e) =>
                      setJudgeInfo({
                        ...judgeInfo,
                        invoiceNumber: e.target.value,
                      })
                    }
                    placeholder='INV-2024-001'
                  />
                </div>
                <div className='space-y-2'>
                  <Label className='text-xs'>Код</Label>
                  <Input
                    value={judgeInfo.code}
                    onChange={(e) =>
                      setJudgeInfo({ ...judgeInfo, code: e.target.value })
                    }
                    placeholder='2024/1234'
                  />
                </div>
                <div className='space-y-2'>
                  <Label className='text-xs'>Нэхэмжлэлийн огноо</Label>
                  <DatePicker
                    selected={
                      judgeInfo.invoiceDate
                        ? new Date(judgeInfo.invoiceDate)
                        : undefined
                    }
                    onSelect={(date) =>
                      setJudgeInfo({
                        ...judgeInfo,
                        invoiceDate: date
                          ? date.toISOString().split('T')[0]
                          : '',
                      })
                    }
                    placeholder='Огноо сонгох'
                  />
                </div>
                <div className='space-y-2'>
                  <Label className='text-xs'>Нэхэмжилсэн огноо</Label>
                  <DatePicker
                    selected={
                      judgeInfo.invoicedDate
                        ? new Date(judgeInfo.invoicedDate)
                        : undefined
                    }
                    onSelect={(date) =>
                      setJudgeInfo({
                        ...judgeInfo,
                        invoicedDate: date
                          ? date.toISOString().split('T')[0]
                          : '',
                      })
                    }
                    placeholder='Огноо сонгох'
                  />
                </div>
                <div className='space-y-2'>
                  <Label className='text-xs'>Захирамжийн утга</Label>
                  <Input
                    value={judgeInfo.ordinance}
                    onChange={(e) =>
                      setJudgeInfo({ ...judgeInfo, ordinance: e.target.value })
                    }
                    placeholder='Шүүхийн тогтоол №123'
                  />
                </div>
                <div className='space-y-2'>
                  <Label className='text-xs'>Захирамжийн дүн</Label>
                  <Input
                    type='number'
                    value={judgeInfo.ordinanceAmount || ''}
                    onChange={(e) =>
                      setJudgeInfo({
                        ...judgeInfo,
                        ordinanceAmount: Number(e.target.value),
                      })
                    }
                    placeholder='5000000'
                  />
                </div>
                <div className='space-y-2'>
                  <Label className='text-xs'>Улсын тэмдэгтийн хураамж</Label>
                  <Input
                    type='number'
                    value={judgeInfo.stampFeeAmount || ''}
                    onChange={(e) =>
                      setJudgeInfo({
                        ...judgeInfo,
                        stampFeeAmount: Number(e.target.value),
                      })
                    }
                    placeholder='50000'
                  />
                </div>
                <div className='space-y-2'>
                  <Label className='text-xs'>Буцаах тэмдэгтийн хураамж</Label>
                  <Input
                    type='number'
                    value={judgeInfo.refundStampFeeAmount || ''}
                    onChange={(e) =>
                      setJudgeInfo({
                        ...judgeInfo,
                        refundStampFeeAmount: Number(e.target.value),
                      })
                    }
                    placeholder='10000'
                  />
                </div>
                <div className='space-y-2'>
                  <Label className='text-xs'>Хаагдсан төлөв</Label>
                  <Select
                    value={judgeInfo.closeStatusId}
                    onValueChange={(value) =>
                      setJudgeInfo({
                        ...judgeInfo,
                        closeStatusId: value,
                      })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder='Төлөв сонгох' />
                    </SelectTrigger>
                    <SelectContent>
                      {judgeCloseStatuses?.map((status) => (
                        <SelectItem
                          key={status.id}
                          value={status.id.toString()}
                        >
                          {status.status}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className='space-y-2'>
                  <Label className='text-xs'>Хариуцсан ажилтан</Label>
                  <Input
                    value={judgeInfo.responsibleEmployee}
                    onChange={(e) =>
                      setJudgeInfo({
                        ...judgeInfo,
                        responsibleEmployee: e.target.value,
                      })
                    }
                    placeholder='Хариуцсан ажилтан'
                  />
                </div>
                <div className='space-y-2'>
                  <Label className='text-xs'>
                    Гүйцэтгэх хуудас хүссэн эсэх
                  </Label>
                  <Input
                    value={judgeInfo.requestedActionPage}
                    onChange={(e) =>
                      setJudgeInfo({
                        ...judgeInfo,
                        requestedActionPage: e.target.value,
                      })
                    }
                    placeholder='15'
                  />
                </div>
                <div className='col-span-2 space-y-2'>
                  <Label className='text-xs'>Тайлбар</Label>
                  <Textarea
                    value={judgeInfo.description}
                    onChange={(e) =>
                      setJudgeInfo({
                        ...judgeInfo,
                        description: e.target.value,
                      })
                    }
                    placeholder='Гэрээний маргаан'
                    rows={3}
                  />
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </TabsContent>
  )
}
