'use client'

import { useState, useEffect, useCallback } from 'react'
import { X } from 'lucide-react'
import type { Tour, Place } from '@/types'

type BookingType = 'tour' | 'hospedaje'

type BookingModalProps = {
    isOpen: boolean
    onClose: () => void
    type: BookingType
    tour?: Tour
    place?: Place
}

export default function BookingModal({ isOpen, onClose, type, tour, place }: BookingModalProps) {
    const [persons, setPersons] = useState(2)
    const [checkIn, setCheckIn] = useState('')
    const [checkOut, setCheckOut] = useState('')
    const [rooms, setRooms] = useState(1)
    const [guests, setGuests] = useState(2)
    const [name, setName] = useState('')
    const [contact, setContact] = useState('')
    const [tourDate, setTourDate] = useState('')

    // Lock body scroll
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden'
        } else {
            document.body.style.overflow = ''
        }
        return () => { document.body.style.overflow = '' }
    }, [isOpen])

    // Close on Escape
    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
        window.addEventListener('keydown', handleEsc)
        return () => window.removeEventListener('keydown', handleEsc)
    }, [onClose])

    if (!isOpen) return null

    const itemName = type === 'tour' ? tour?.title : place?.name
    const price = type === 'tour'
        ? (tour?.price || 0)
        : ((place?.details as Record<string, unknown>)?.pricePerNight as number || 0)
    const whatsappNumber = type === 'tour'
        ? (tour?.whatsappNumber || '51999516339')
        : ((place?.details as Record<string, unknown>)?.whatsappNumber as string || '51999516339')

    // Calculate totals
    const tourTotal = price * persons
    const nights = checkIn && checkOut
        ? Math.max(1, Math.ceil((new Date(checkOut).getTime() - new Date(checkIn).getTime()) / (1000 * 60 * 60 * 24)))
        : 0
    const hospedajeTotal = price * nights * rooms

    const handleSubmit = () => {
        const msg = type === 'tour'
            ? `Hola! Quiero reservar el tour "${itemName}". Somos ${persons} personas para el ${tourDate}.`
            : `Hola! Quiero cotizar una reserva en "${itemName}" del ${checkIn} al ${checkOut}. ${guests} huéspedes, ${rooms} habitación(es).`
        window.open(`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(msg)}`, '_blank')
        onClose()
    }

    return (
        <div
            className="fixed inset-0 z-[2000] flex items-center justify-center p-6 animate-in fade-in duration-300"
            style={{ background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(6px)' }}
            onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
        >
            <div className="bg-white rounded-2xl max-w-[520px] w-full max-h-[90vh] overflow-y-auto shadow-2xl animate-in slide-in-from-bottom-6 duration-400">
                {/* Header */}
                <div className="px-7 py-6 border-b border-[#f0ede6] flex items-center justify-between">
                    <h2 className="font-heading text-xl text-primary">
                        {type === 'tour' ? 'Reservar Tour' : 'Reservar Hospedaje'}
                    </h2>
                    <button
                        onClick={onClose}
                        className="w-9 h-9 rounded-full bg-surface-alt flex items-center justify-center hover:bg-[#e8e0d0] transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Body */}
                <div className="p-7">
                    <p className="text-foreground-secondary mb-5">
                        <strong className="text-primary">{itemName}</strong>
                    </p>

                    {type === 'tour' ? (
                        /* Tour form */
                        <>
                            <FormGroup label="Fecha del tour">
                                <input type="date" className="form-input-custom" value={tourDate} onChange={(e) => setTourDate(e.target.value)} />
                            </FormGroup>
                            <FormGroup label="Número de personas">
                                <input
                                    type="number" className="form-input-custom" value={persons} min={1} max={20}
                                    onChange={(e) => setPersons(parseInt(e.target.value) || 1)}
                                />
                            </FormGroup>
                            <FormGroup label="Nombre completo">
                                <input type="text" className="form-input-custom" placeholder="Tu nombre" value={name} onChange={(e) => setName(e.target.value)} />
                            </FormGroup>
                            <FormGroup label="Email o WhatsApp">
                                <input type="text" className="form-input-custom" placeholder="+51 999 999 999" value={contact} onChange={(e) => setContact(e.target.value)} />
                            </FormGroup>

                            {/* Quote */}
                            <div className="bg-surface-alt rounded-xl p-5 mt-2">
                                <QuoteRow label="Precio por persona" value={`S/${price}`} />
                                <QuoteRow label="Personas" value={persons.toString()} />
                                <QuoteRow label="Total estimado" value={`S/${tourTotal}`} isTotal />
                            </div>
                        </>
                    ) : (
                        /* Hospedaje form */
                        <>
                            <div className="grid grid-cols-2 gap-3">
                                <FormGroup label="Check-in">
                                    <input type="date" className="form-input-custom" value={checkIn} onChange={(e) => setCheckIn(e.target.value)} />
                                </FormGroup>
                                <FormGroup label="Check-out">
                                    <input type="date" className="form-input-custom" value={checkOut} onChange={(e) => setCheckOut(e.target.value)} />
                                </FormGroup>
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <FormGroup label="Huéspedes">
                                    <input
                                        type="number" className="form-input-custom" value={guests} min={1} max={10}
                                        onChange={(e) => setGuests(parseInt(e.target.value) || 1)}
                                    />
                                </FormGroup>
                                <FormGroup label="Habitaciones">
                                    <input
                                        type="number" className="form-input-custom" value={rooms} min={1} max={5}
                                        onChange={(e) => setRooms(parseInt(e.target.value) || 1)}
                                    />
                                </FormGroup>
                            </div>
                            <FormGroup label="Nombre completo">
                                <input type="text" className="form-input-custom" placeholder="Tu nombre" value={name} onChange={(e) => setName(e.target.value)} />
                            </FormGroup>
                            <FormGroup label="Email o WhatsApp">
                                <input type="text" className="form-input-custom" placeholder="+51 999 999 999" value={contact} onChange={(e) => setContact(e.target.value)} />
                            </FormGroup>

                            {/* Quote */}
                            <div className="bg-surface-alt rounded-xl p-5 mt-2">
                                <QuoteRow label="Precio por noche" value={`S/${price}`} />
                                <QuoteRow label="Noches" value={nights > 0 ? nights.toString() : '-'} />
                                <QuoteRow label="Habitaciones" value={rooms.toString()} />
                                <QuoteRow
                                    label="Total estimado"
                                    value={nights > 0 ? `S/${hospedajeTotal}` : 'Selecciona fechas'}
                                    isTotal
                                />
                            </div>
                        </>
                    )}

                    {/* Submit */}
                    <button
                        onClick={handleSubmit}
                        className="w-full mt-5 py-3.5 bg-primary text-white rounded-xl font-semibold hover:bg-primary-hover transition-colors"
                    >
                        {type === 'tour' ? 'Solicitar Reserva por WhatsApp' : 'Solicitar Cotización por WhatsApp'}
                    </button>
                </div>
            </div>
        </div>
    )
}

function FormGroup({ label, children }: { label: string; children: React.ReactNode }) {
    return (
        <div className="mb-5">
            <label className="block text-sm font-semibold text-primary mb-1.5">{label}</label>
            {children}
        </div>
    )
}

function QuoteRow({ label, value, isTotal }: { label: string; value: string; isTotal?: boolean }) {
    return (
        <div className={`flex justify-between py-1.5 text-sm ${isTotal ? 'font-bold text-primary text-base border-t-[1.5px] border-[#d4cfc4] mt-2 pt-3' : ''}`}>
            <span>{label}</span>
            <span>{value}</span>
        </div>
    )
}
