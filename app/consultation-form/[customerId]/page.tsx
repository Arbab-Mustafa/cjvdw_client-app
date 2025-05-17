"use client"

import type React from "react"

import { useParams } from "next/navigation"
import ProtectedRoute from "@/components/protected-route"
import { useCustomer } from "@/context/customer-context"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import type { ConsultationForm } from "@/types/customer"

export default function ConsultationFormPage() {
  const params = useParams()
  const customerId = params.customerId as string
  const { getCustomerById, updateCustomerConsultationForm } = useCustomer()
  const customer = getCustomerById(customerId)
  const router = useRouter()

  const [form, setForm] = useState<ConsultationForm>({
    medicalConditions: {
      heartProblems: false,
      highBloodPressure: false,
      lowBloodPressure: false,
      circulationProblems: false,
      varicoseVeins: false,
      asthma: false,
      diabetes: false,
      epilepsy: false,
      cancer: false,
      skinConditions: false,
      other: "",
    },
    allergies: {
      latex: false,
      plasters: false,
      perfumes: false,
      other: "",
    },
    skinType: "normal",
    skinConcerns: {
      acne: false,
      aging: false,
      sensitivity: false,
      rosacea: false,
      pigmentation: false,
      dryness: false,
      oiliness: false,
      other: "",
    },
    currentSkincare: "",
    medications: "",
    pregnant: false,
    consentToTreatment: false,
    consentToPhotos: false,
    consentToMarketing: false,
    completedAt: null,
  })

  useEffect(() => {
    if (customer?.consultationForm) {
      setForm(customer.consultationForm)
    }
  }, [customer])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!form.consentToTreatment) {
      toast.error("You must consent to treatment to submit the form")
      return
    }

    const updatedForm = {
      ...form,
      completedAt: new Date(),
    }

    updateCustomerConsultationForm(customerId, updatedForm)
    toast.success("Consultation form submitted successfully")
    router.push("/consultation-form/thank-you")
  }

  if (!customer) {
    return (
      <ProtectedRoute allowedRoles={["owner", "therapist", "manager"]}>
        <div className="container mx-auto px-4 py-8 pt-20">
          <Card>
            <CardHeader>
              <CardTitle>Customer Not Found</CardTitle>
            </CardHeader>
            <CardContent>
              <p>The customer you are looking for does not exist.</p>
            </CardContent>
          </Card>
        </div>
      </ProtectedRoute>
    )
  }

  return (
    <ProtectedRoute allowedRoles={["owner", "therapist", "manager"]}>
      <div className="container mx-auto px-4 py-8 pt-20 mb-20">
        <Card className="max-w-4xl mx-auto">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl text-pink-800">Consultation Form</CardTitle>
            <CardDescription>
              For {customer.firstName} {customer.lastName}
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-6">
              {/* Medical Conditions */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-pink-700">Medical Conditions</h3>
                <p className="text-sm text-gray-500">Please check any conditions that apply to you:</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="heartProblems"
                      checked={form.medicalConditions.heartProblems}
                      onCheckedChange={(checked) =>
                        setForm({
                          ...form,
                          medicalConditions: {
                            ...form.medicalConditions,
                            heartProblems: checked as boolean,
                          },
                        })
                      }
                    />
                    <Label htmlFor="heartProblems">Heart Problems</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="highBloodPressure"
                      checked={form.medicalConditions.highBloodPressure}
                      onCheckedChange={(checked) =>
                        setForm({
                          ...form,
                          medicalConditions: {
                            ...form.medicalConditions,
                            highBloodPressure: checked as boolean,
                          },
                        })
                      }
                    />
                    <Label htmlFor="highBloodPressure">High Blood Pressure</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="lowBloodPressure"
                      checked={form.medicalConditions.lowBloodPressure}
                      onCheckedChange={(checked) =>
                        setForm({
                          ...form,
                          medicalConditions: {
                            ...form.medicalConditions,
                            lowBloodPressure: checked as boolean,
                          },
                        })
                      }
                    />
                    <Label htmlFor="lowBloodPressure">Low Blood Pressure</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="circulationProblems"
                      checked={form.medicalConditions.circulationProblems}
                      onCheckedChange={(checked) =>
                        setForm({
                          ...form,
                          medicalConditions: {
                            ...form.medicalConditions,
                            circulationProblems: checked as boolean,
                          },
                        })
                      }
                    />
                    <Label htmlFor="circulationProblems">Circulation Problems</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="varicoseVeins"
                      checked={form.medicalConditions.varicoseVeins}
                      onCheckedChange={(checked) =>
                        setForm({
                          ...form,
                          medicalConditions: {
                            ...form.medicalConditions,
                            varicoseVeins: checked as boolean,
                          },
                        })
                      }
                    />
                    <Label htmlFor="varicoseVeins">Varicose Veins</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="asthma"
                      checked={form.medicalConditions.asthma}
                      onCheckedChange={(checked) =>
                        setForm({
                          ...form,
                          medicalConditions: {
                            ...form.medicalConditions,
                            asthma: checked as boolean,
                          },
                        })
                      }
                    />
                    <Label htmlFor="asthma">Asthma</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="diabetes"
                      checked={form.medicalConditions.diabetes}
                      onCheckedChange={(checked) =>
                        setForm({
                          ...form,
                          medicalConditions: {
                            ...form.medicalConditions,
                            diabetes: checked as boolean,
                          },
                        })
                      }
                    />
                    <Label htmlFor="diabetes">Diabetes</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="epilepsy"
                      checked={form.medicalConditions.epilepsy}
                      onCheckedChange={(checked) =>
                        setForm({
                          ...form,
                          medicalConditions: {
                            ...form.medicalConditions,
                            epilepsy: checked as boolean,
                          },
                        })
                      }
                    />
                    <Label htmlFor="epilepsy">Epilepsy</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="cancer"
                      checked={form.medicalConditions.cancer}
                      onCheckedChange={(checked) =>
                        setForm({
                          ...form,
                          medicalConditions: {
                            ...form.medicalConditions,
                            cancer: checked as boolean,
                          },
                        })
                      }
                    />
                    <Label htmlFor="cancer">Cancer</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="skinConditions"
                      checked={form.medicalConditions.skinConditions}
                      onCheckedChange={(checked) =>
                        setForm({
                          ...form,
                          medicalConditions: {
                            ...form.medicalConditions,
                            skinConditions: checked as boolean,
                          },
                        })
                      }
                    />
                    <Label htmlFor="skinConditions">Skin Conditions</Label>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="otherMedical">Other Medical Conditions</Label>
                  <Textarea
                    id="otherMedical"
                    placeholder="Please specify any other medical conditions"
                    value={form.medicalConditions.other}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        medicalConditions: {
                          ...form.medicalConditions,
                          other: e.target.value,
                        },
                      })
                    }
                  />
                </div>
              </div>

              {/* Allergies */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-pink-700">Allergies</h3>
                <p className="text-sm text-gray-500">Please check any allergies that apply to you:</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="latex"
                      checked={form.allergies.latex}
                      onCheckedChange={(checked) =>
                        setForm({
                          ...form,
                          allergies: {
                            ...form.allergies,
                            latex: checked as boolean,
                          },
                        })
                      }
                    />
                    <Label htmlFor="latex">Latex</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="plasters"
                      checked={form.allergies.plasters}
                      onCheckedChange={(checked) =>
                        setForm({
                          ...form,
                          allergies: {
                            ...form.allergies,
                            plasters: checked as boolean,
                          },
                        })
                      }
                    />
                    <Label htmlFor="plasters">Plasters</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="perfumes"
                      checked={form.allergies.perfumes}
                      onCheckedChange={(checked) =>
                        setForm({
                          ...form,
                          allergies: {
                            ...form.allergies,
                            perfumes: checked as boolean,
                          },
                        })
                      }
                    />
                    <Label htmlFor="perfumes">Perfumes</Label>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="otherAllergies">Other Allergies</Label>
                  <Textarea
                    id="otherAllergies"
                    placeholder="Please specify any other allergies"
                    value={form.allergies.other}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        allergies: {
                          ...form.allergies,
                          other: e.target.value,
                        },
                      })
                    }
                  />
                </div>
              </div>

              {/* Skin Type */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-pink-700">Skin Type</h3>
                <RadioGroup
                  value={form.skinType}
                  onValueChange={(value) => setForm({ ...form, skinType: value as any })}
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="normal" id="normal" />
                    <Label htmlFor="normal">Normal</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="dry" id="dry" />
                    <Label htmlFor="dry">Dry</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="oily" id="oily" />
                    <Label htmlFor="oily">Oily</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="combination" id="combination" />
                    <Label htmlFor="combination">Combination</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="sensitive" id="sensitive" />
                    <Label htmlFor="sensitive">Sensitive</Label>
                  </div>
                </RadioGroup>
              </div>

              {/* Skin Concerns */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-pink-700">Skin Concerns</h3>
                <p className="text-sm text-gray-500">Please check any skin concerns that apply to you:</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="acne"
                      checked={form.skinConcerns.acne}
                      onCheckedChange={(checked) =>
                        setForm({
                          ...form,
                          skinConcerns: {
                            ...form.skinConcerns,
                            acne: checked as boolean,
                          },
                        })
                      }
                    />
                    <Label htmlFor="acne">Acne</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="aging"
                      checked={form.skinConcerns.aging}
                      onCheckedChange={(checked) =>
                        setForm({
                          ...form,
                          skinConcerns: {
                            ...form.skinConcerns,
                            aging: checked as boolean,
                          },
                        })
                      }
                    />
                    <Label htmlFor="aging">Aging</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="sensitivity"
                      checked={form.skinConcerns.sensitivity}
                      onCheckedChange={(checked) =>
                        setForm({
                          ...form,
                          skinConcerns: {
                            ...form.skinConcerns,
                            sensitivity: checked as boolean,
                          },
                        })
                      }
                    />
                    <Label htmlFor="sensitivity">Sensitivity</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="rosacea"
                      checked={form.skinConcerns.rosacea}
                      onCheckedChange={(checked) =>
                        setForm({
                          ...form,
                          skinConcerns: {
                            ...form.skinConcerns,
                            rosacea: checked as boolean,
                          },
                        })
                      }
                    />
                    <Label htmlFor="rosacea">Rosacea</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="pigmentation"
                      checked={form.skinConcerns.pigmentation}
                      onCheckedChange={(checked) =>
                        setForm({
                          ...form,
                          skinConcerns: {
                            ...form.skinConcerns,
                            pigmentation: checked as boolean,
                          },
                        })
                      }
                    />
                    <Label htmlFor="pigmentation">Pigmentation</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="dryness"
                      checked={form.skinConcerns.dryness}
                      onCheckedChange={(checked) =>
                        setForm({
                          ...form,
                          skinConcerns: {
                            ...form.skinConcerns,
                            dryness: checked as boolean,
                          },
                        })
                      }
                    />
                    <Label htmlFor="dryness">Dryness</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="oiliness"
                      checked={form.skinConcerns.oiliness}
                      onCheckedChange={(checked) =>
                        setForm({
                          ...form,
                          skinConcerns: {
                            ...form.skinConcerns,
                            oiliness: checked as boolean,
                          },
                        })
                      }
                    />
                    <Label htmlFor="oiliness">Oiliness</Label>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="otherSkinConcerns">Other Skin Concerns</Label>
                  <Textarea
                    id="otherSkinConcerns"
                    placeholder="Please specify any other skin concerns"
                    value={form.skinConcerns.other}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        skinConcerns: {
                          ...form.skinConcerns,
                          other: e.target.value,
                        },
                      })
                    }
                  />
                </div>
              </div>

              {/* Current Skincare */}
              <div className="space-y-2">
                <Label htmlFor="currentSkincare">Current Skincare Routine</Label>
                <Textarea
                  id="currentSkincare"
                  placeholder="Please describe your current skincare routine"
                  value={form.currentSkincare}
                  onChange={(e) => setForm({ ...form, currentSkincare: e.target.value })}
                />
              </div>

              {/* Medications */}
              <div className="space-y-2">
                <Label htmlFor="medications">Current Medications</Label>
                <Textarea
                  id="medications"
                  placeholder="Please list any medications you are currently taking"
                  value={form.medications}
                  onChange={(e) => setForm({ ...form, medications: e.target.value })}
                />
              </div>

              {/* Pregnancy */}
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="pregnant"
                  checked={form.pregnant}
                  onCheckedChange={(checked) => setForm({ ...form, pregnant: checked as boolean })}
                />
                <Label htmlFor="pregnant">Are you pregnant or breastfeeding?</Label>
              </div>

              {/* Consent */}
              <div className="space-y-4 pt-4 border-t">
                <h3 className="text-lg font-medium text-pink-700">Consent</h3>
                <div className="flex items-start space-x-2">
                  <Checkbox
                    id="consentToTreatment"
                    checked={form.consentToTreatment}
                    onCheckedChange={(checked) => setForm({ ...form, consentToTreatment: checked as boolean })}
                    className="mt-1"
                  />
                  <Label htmlFor="consentToTreatment" className="text-sm">
                    I consent to treatment and confirm that the information provided is accurate and complete. I
                    understand that withholding information may affect the safety and effectiveness of my treatment.
                    <span className="text-pink-600">*</span>
                  </Label>
                </div>
                <div className="flex items-start space-x-2">
                  <Checkbox
                    id="consentToPhotos"
                    checked={form.consentToPhotos}
                    onCheckedChange={(checked) => setForm({ ...form, consentToPhotos: checked as boolean })}
                    className="mt-1"
                  />
                  <Label htmlFor="consentToPhotos" className="text-sm">
                    I consent to before and after photos being taken for my treatment records. These will not be used
                    for marketing without additional consent.
                  </Label>
                </div>
                <div className="flex items-start space-x-2">
                  <Checkbox
                    id="consentToMarketing"
                    checked={form.consentToMarketing}
                    onCheckedChange={(checked) => setForm({ ...form, consentToMarketing: checked as boolean })}
                    className="mt-1"
                  />
                  <Label htmlFor="consentToMarketing" className="text-sm">
                    I consent to receiving marketing communications about special offers and new treatments.
                  </Label>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" type="button" onClick={() => router.back()}>
                Cancel
              </Button>
              <Button type="submit">Submit</Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </ProtectedRoute>
  )
}
