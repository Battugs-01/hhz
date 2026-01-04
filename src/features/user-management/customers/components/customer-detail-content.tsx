import { type Customer } from '@/services'
import {
  Briefcase,
  Calendar,
  Hash,
  Home,
  MapPin,
  Phone,
  User,
} from 'lucide-react'
import { formatDate } from '@/lib/utils'
import { DetailCard } from '@/components/detail-card'
import type { DetailField } from '@/components/detail-field'

type CustomerDetailContentProps = {
  customer: Customer
}

export function CustomerDetailContent({
  customer,
}: CustomerDetailContentProps) {
  const personalFields: DetailField[] = [
    {
      label: 'Харилцагчийн ID',
      value: customer.customerId,
      icon: <Hash className='h-4 w-4' />,
      copy: true,
      highlight: true,
    },
    {
      label: 'Нэр',
      value: customer.firstName,
      icon: <User className='h-4 w-4' />,
    },
    {
      label: 'Овог',
      value: customer.lastName,
      icon: <User className='h-4 w-4' />,
    },
    {
      label: 'Регистрийн дугаар',
      value: customer.registerNumber,
      icon: <Hash className='h-4 w-4' />,
      copy: true,
      mask: true,
    },
    {
      label: 'Утасны дугаар',
      value: customer.phoneNumber,
      icon: <Phone className='h-4 w-4' />,
      copy: true,
    },
  ]

  const workFields: DetailField[] = [
    {
      label: 'Ажлын нэр',
      value: customer.jobName || '-',
      icon: <Briefcase className='h-4 w-4' />,
    },
    {
      label: 'Ажлын код',
      value: customer.job || '-',
      icon: <Hash className='h-4 w-4' />,
    },
  ]

  const locationFields: DetailField[] = [
    {
      label: 'Хаяг',
      value: customer.address || '-',
      icon: <Home className='h-4 w-4' />,
    },
    {
      label: 'Дүүрэг',
      value: customer.district || '-',
      icon: <MapPin className='h-4 w-4' />,
      badge: true,
    },
    {
      label: 'Хороо',
      value: customer.khoroo || '-',
      icon: <MapPin className='h-4 w-4' />,
    },
    {
      label: 'Байршил',
      value: customer.location || '-',
      icon: <MapPin className='h-4 w-4' />,
    },
  ]

  const additionalLocationFields: DetailField[] = [
    {
      label: 'Одоогийн байршил',
      value: customer.currentLocation || '-',
      icon: <MapPin className='h-4 w-4' />,
    },
    {
      label: 'Ажлын байршил',
      value: customer.workLocation || '-',
      icon: <MapPin className='h-4 w-4' />,
    },
    {
      label: 'Нэмэлт байршил',
      value: customer.additionalLocation || '-',
      icon: <MapPin className='h-4 w-4' />,
    },
  ]

  const systemFields: DetailField[] = [
    {
      label: 'Харилцагчийн ID',
      value: customer.id,
      icon: <Hash className='h-4 w-4' />,
      copy: true,
      mask: true,
    },
    {
      label: 'Үүсгэсэн огноо',
      value: formatDate(customer.createdAt),
      icon: <Calendar className='h-4 w-4' />,
    },
    {
      label: 'Зассан огноо',
      value: formatDate(customer.updatedAt),
      icon: <Calendar className='h-4 w-4' />,
    },
  ]

  return (
    <div className='space-y-4'>
      {/* Personal Information */}
      <DetailCard title='Хувийн мэдээлэл' fields={personalFields} />

      {/* Work Information */}
      {(customer.jobName || customer.job) && (
        <DetailCard title='Ажлын мэдээлэл' fields={workFields} />
      )}

      {/* Location Information */}
      <DetailCard title='Байршлын мэдээлэл' fields={locationFields} />

      {/* Additional Locations */}
      {(customer.currentLocation ||
        customer.workLocation ||
        customer.additionalLocation) && (
        <DetailCard title='Нэмэлт байршил' fields={additionalLocationFields} />
      )}

      {/* System Information */}
      <DetailCard title='Системийн мэдээлэл' fields={systemFields} />
    </div>
  )
}
