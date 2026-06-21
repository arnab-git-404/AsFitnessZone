'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { Tag } from 'primereact/tag';
import { Dropdown } from 'primereact/dropdown';
import { Dialog } from 'primereact/dialog';
import { Toast } from 'primereact/toast';
import { Dumbbell, Award, IndianRupee, Calendar, UserCheck, X, Check, Loader2 } from 'lucide-react';
import type { TrainerResponse } from '@/lib/types';

const feeTypeLabels: Record<string, string> = {
    monthly: 'Monthly',
    quarterly: 'Quarterly',
    sixMonths: '6 Months',
    annual: 'Annual',
};

const feeTypeOptions = [
    { label: 'Monthly', value: 'monthly' },
    { label: 'Quarterly', value: 'quarterly' },
    { label: '6 Months', value: 'sixMonths' },
    { label: 'Annual', value: 'annual' },
];

export default function UserTrainerPage() {
    const router = useRouter();
    const toastRef = useRef<Toast>(null);
    const [assignment, setAssignment] = useState<any>(null);
    const [trainers, setTrainers] = useState<TrainerResponse[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showSelector, setShowSelector] = useState(false);
    const [selectedTrainer, setSelectedTrainer] = useState('');
    const [selectedFeeType, setSelectedFeeType] = useState('monthly');
    const [isAssigning, setIsAssigning] = useState(false);
    const [isCancelling, setIsCancelling] = useState(false);

    const fetchData = async () => {
        try {
            const [assignmentRes, trainersRes] = await Promise.all([
                fetch('/api/user/trainer-assignments'),
                fetch('/api/trainers'),
            ]);

            if (assignmentRes.ok) {
                const data = await assignmentRes.json();
                setAssignment(data.assignment);
            }
            if (trainersRes.ok) {
                const data = await trainersRes.json();
                setTrainers(data.trainers);
            }
        } catch {
            toastRef.current?.show({ severity: 'error', summary: 'Failed to load data' });
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleAssign = async () => {
        if (!selectedTrainer) {
            toastRef.current?.show({ severity: 'error', summary: 'Please select a trainer' });
            return;
        }
        setIsAssigning(true);
        try {
            const response = await fetch('/api/user/trainer-assignments', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ trainerId: selectedTrainer, feeType: selectedFeeType }),
            });
            const data = await response.json();
            if (response.ok) {
                toastRef.current?.show({ severity: 'success', summary: 'Trainer assigned successfully!' });
                setShowSelector(false);
                setAssignment(data.assignment);
            } else {
                toastRef.current?.show({ severity: 'error', summary: data.error || 'Failed to assign' });
            }
        } catch {
            toastRef.current?.show({ severity: 'error', summary: 'Something went wrong' });
        } finally {
            setIsAssigning(false);
        }
    };

    const handleCancel = async () => {
        if (!confirm('Are you sure you want to cancel your current trainer assignment?')) return;
        setIsCancelling(true);
        try {
            const response = await fetch('/api/user/trainer-assignments', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
            });
            if (response.ok) {
                toastRef.current?.show({ severity: 'success', summary: 'Trainer assignment cancelled' });
                setAssignment(null);
            } else {
                const data = await response.json();
                toastRef.current?.show({ severity: 'error', summary: data.error || 'Failed to cancel' });
            }
        } catch {
            toastRef.current?.show({ severity: 'error', summary: 'Something went wrong' });
        } finally {
            setIsCancelling(false);
        }
    };

    const filteredFeeOptions = feeTypeOptions.map(ft => {
        const trainer = trainers.find(t => t._id === selectedTrainer);
        const price = trainer?.pricing?.[ft.value as keyof typeof trainer.pricing];
        return { ...ft, disabled: !price || price <= 0 };
    });

    const dialogFooter = (
        <div className="flex justify-end gap-3">
            <Button className="p-button-outlined" label="Cancel" onClick={() => setShowSelector(false)} />
            <Button className="bg-primary border-primary text-white" label={isAssigning ? 'Assigning...' : 'Confirm'} onClick={handleAssign} disabled={isAssigning || !selectedTrainer} />
        </div>
    );

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <Dumbbell className="h-12 w-12 text-primary animate-pulse mx-auto mb-4" />
                    <p className="text-muted-foreground">Loading...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
            <Toast ref={toastRef} />
            <div className="container mx-auto px-4 py-8">
                <div className="max-w-4xl mx-auto space-y-8">
                    {/* Header */}
                    <div>
                        <h1 className="text-3xl font-bold mb-2">My <span className="text-primary">Trainer</span></h1>
                        <p className="text-muted-foreground">Manage your personal training assignment</p>
                    </div>

                    {assignment && assignment.trainerId ? (
                        /* Active Assignment Card */
                        <Card className="!border-primary/30">
                            <div className="bg-primary/5 border-b border-primary/10 p-6">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                                            <UserCheck className="h-6 w-6 text-primary" />
                                        </div>
                                        <div>
                                            <h2 className="text-xl font-semibold">Your Trainer</h2>
                                            <p className="text-sm text-muted-foreground">Active assignment</p>
                                        </div>
                                    </div>
                                    <Tag severity="success" className="flex items-center gap-1">
                                        <Check className="h-3 w-3 mr-1" />Active
                                    </Tag>
                                </div>
                            </div>
                            <div className="p-6 space-y-6">
                                <div className="flex items-start gap-6">
                                    <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center flex-shrink-0">
                                        <Award className="h-10 w-10 text-primary" />
                                    </div>
                                    <div className="flex-1 space-y-2">
                                        <h2 className="text-2xl font-bold">{assignment.trainerId.name}</h2>
                                        <p className="text-sm text-muted-foreground">{assignment.trainerId.bio}</p>
                                        {assignment.trainerId.experience && (
                                            <p className="text-sm font-medium">Experience: {assignment.trainerId.experience}</p>
                                        )}
                                        {assignment.trainerId.specializations?.length > 0 && (
                                            <div className="flex flex-wrap gap-1.5 pt-1">
                                                {assignment.trainerId.specializations.map((s: string, i: number) => (
                                                    <Tag key={i} value={s} severity="secondary" className="text-xs" />
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                                    <div className="bg-muted/50 rounded-lg p-3 text-center">
                                        <div className="text-xs text-muted-foreground mb-1">Fee Plan</div>
                                        <div className="font-semibold">{feeTypeLabels[assignment.feeType] || assignment.feeType}</div>
                                    </div>
                                    <div className="bg-muted/50 rounded-lg p-3 text-center">
                                        <div className="text-xs text-muted-foreground mb-1">Amount</div>
                                        <div className="font-semibold flex items-center justify-center"><IndianRupee className="h-3.5 w-3.5" />{assignment.amount}</div>
                                    </div>
                                    <div className="bg-muted/50 rounded-lg p-3 text-center">
                                        <div className="text-xs text-muted-foreground mb-1">Start Date</div>
                                        <div className="font-semibold text-sm">{new Date(assignment.startDate).toLocaleDateString()}</div>
                                    </div>
                                    <div className="bg-muted/50 rounded-lg p-3 text-center">
                                        <div className="text-xs text-muted-foreground mb-1">End Date</div>
                                        <div className="font-semibold text-sm">{new Date(assignment.endDate).toLocaleDateString()}</div>
                                    </div>
                                </div>

                                <div className="flex gap-3 pt-2">
                                    <Button className="p-button-outlined" onClick={() => setShowSelector(true)}>
                                        Change Trainer
                                    </Button>
                                    <Button className="p-button-outlined text-destructive !border-destructive/30 hover:!bg-destructive/10" onClick={handleCancel} disabled={isCancelling}>
                                        {isCancelling ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <X className="h-4 w-4 mr-2" />}
                                        Cancel Assignment
                                    </Button>
                                </div>
                            </div>
                        </Card>
                    ) : (
                        /* No Assignment - Show Trainer Options */
                        <div className="space-y-6">
                            <Card className="!border-border/50">
                                <div className="p-12 text-center">
                                    <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                                        <UserCheck className="h-8 w-8 text-primary" />
                                    </div>
                                    <h2 className="text-xl font-semibold mb-2">No Trainer Assigned</h2>
                                    <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                                        Select a personal trainer to get one-on-one guidance tailored to your fitness goals.
                                    </p>
                                    <Button className="bg-primary border-primary text-white" onClick={() => setShowSelector(true)}>
                                        Choose a Trainer
                                    </Button>
                                </div>
                            </Card>

                            {/* Available Trainers Preview */}
                            <div>
                                <h2 className="text-xl font-semibold mb-4">Available Trainers</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {trainers.slice(0, 4).map((trainer) => (
                                        <Card key={trainer._id} className="!border-border/50 hover:!border-primary/50 transition-all cursor-pointer" onClick={() => {
                                            setSelectedTrainer(trainer._id);
                                            setShowSelector(true);
                                        }}>
                                            <div className="p-4 flex items-start gap-4">
                                                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                                                    <Award className="h-6 w-6 text-primary" />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <h3 className="font-semibold">{trainer.name}</h3>
                                                    <p className="text-xs text-muted-foreground line-clamp-1">{trainer.bio}</p>
                                                    {trainer.pricing && trainer.pricing.monthly > 0 && (
                                                        <p className="text-xs text-primary font-medium mt-1">
                                                            From ₹{trainer.pricing.monthly}/mo
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        </Card>
                                    ))}
                                </div>
                                {trainers.length > 4 && (
                                    <p className="text-center text-sm text-muted-foreground mt-4">
                                        +{trainers.length - 4} more trainers available
                                    </p>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Trainer Selector Dialog */}
                    <Dialog header="Select a Trainer" visible={showSelector} onHide={() => setShowSelector(false)} footer={dialogFooter} className="sm:max-w-lg">
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <span className="text-sm font-medium">Choose Trainer</span>
                                <div className="max-h-60 overflow-y-auto space-y-2">
                                    {trainers.map((trainer) => (
                                        <div
                                            key={trainer._id}
                                            className={`p-3 rounded-lg border cursor-pointer transition-all ${
                                                selectedTrainer === trainer._id
                                                    ? 'border-primary bg-primary/5'
                                                    : 'border-border hover:border-primary/50'
                                            }`}
                                            onClick={() => setSelectedTrainer(trainer._id)}
                                        >
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <div className="font-medium">{trainer.name}</div>
                                                    <div className="text-xs text-muted-foreground">{trainer.bio.slice(0, 80)}...</div>
                                                </div>
                                                {selectedTrainer === trainer._id && (
                                                    <Check className="h-5 w-5 text-primary flex-shrink-0" />
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                    {trainers.length === 0 && (
                                        <p className="text-sm text-muted-foreground text-center py-4">No trainers available</p>
                                    )}
                                </div>
                            </div>

                            {selectedTrainer && (
                                <div className="space-y-2">
                                    <span className="text-sm font-medium">Fee Plan</span>
                                    <Dropdown
                                        value={selectedFeeType}
                                        options={filteredFeeOptions}
                                        onChange={e => setSelectedFeeType(e.value)}
                                        className="w-full"
                                    />
                                </div>
                            )}
                        </div>
                    </Dialog>
                </div>
            </div>
        </div>
    );
}
