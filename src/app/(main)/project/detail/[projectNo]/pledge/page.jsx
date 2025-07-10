"use client"

import { useState, useEffect } from "react"
import { useParams, useSearchParams } from "next/navigation"
import axios from "axios"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Separator } from "@/components/ui/separator"
import { ChevronUp, ChevronDown, Heart } from "lucide-react"
import Image from "next/image"

export default function TumblbugSupportPage() {
  const [additionalDonation, setAdditionalDonation] = useState("")
  const [personalInfoConsent, setPersonalInfoConsent] = useState(false)
  const [termsConsent, setTermsConsent] = useState(false)
  const [termsExpanded, setTermsExpanded] = useState(false)
  const [shippingAddress, setShippingAddress] = useState("")

  const { projectNo } = useParams();
  const searchParams = useSearchParams();
  const rewardId = searchParams.get('rewardId');
  const [project, setProject] = useState(null);

  useEffect(() => {
    if (projectNo) {
      axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/project/${projectNo}`).then((res) => {
        setProject(res.data.data);
      });
    }
  }, [projectNo]);

  if (!project) return <div>로딩 중...</div>;

  // rewardId에 따라 선택된 리워드 찾기
  const selectedReward = rewardId 
    ? project.rewards?.find(reward => reward.id === parseInt(rewardId))
    : project.rewards?.[0]; // rewardId가 없으면 첫 번째 리워드 사용

  // 선택된 리워드가 없으면 에러 처리
  if (!selectedReward) {
    return <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <h2 className="text-xl font-bold mb-2">리워드를 찾을 수 없습니다</h2>
        <p className="text-gray-600">올바른 리워드를 선택해주세요.</p>
      </div>
    </div>;
  }

  // 선택된 리워드의 금액을 기본 금액으로 사용
  const baseAmount = selectedReward.amount || 0;
  const additionalAmount = Number.parseInt(additionalDonation) || 0
  const totalAmount = baseAmount + additionalAmount

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center">
          <Image
            src="/images/tumblbug_logo.png"
            alt="텀블벅 로고"
            width={132}
            height={36}
            className="h-9 w-auto"
          />
          <div className="ml-4 text-gray-600">프로젝트 후원하기</div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Project Information */}
            <Card>
              <CardContent className="p-6">
                <div className="flex gap-4">
                  <div className="w-24 h-24 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                    <Image
                      src={project.thumbnailUrl || "/placeholder.svg?height=96&width=96"}
                      alt="프로젝트 이미지"
                      width={96}
                      height={96}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <div className="text-sm text-gray-500 mb-2">{project.creatorName} | {project.creatorInfo}</div>
                    <h1 className="text-xl font-bold mb-2">{project.title}</h1>
                    <div className="flex items-center gap-2">
                      <span className="text-lg font-bold">{project.currentAmount?.toLocaleString()}원</span>
                      <span className="text-red-500 font-bold">
                        {project.goalAmount ? Math.round((project.currentAmount / project.goalAmount) * 100) : 0}%
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Gift Selection */}
            <div>
              <h2 className="text-lg font-bold mb-4">선물 정보</h2>
              <Card>
                <CardContent className="p-6">
                  <div className="mb-4">
                    <div className="font-medium mb-2">선물 구성</div>
                    <div className="text-sm text-gray-600 mb-2">
                      {selectedReward.title || '리워드 정보 없음'}
                    </div>
                    {selectedReward.description && (
                      <ul className="text-sm text-gray-600 ml-4 space-y-1">
                        {selectedReward.description.split('\n').map((item, index) => (
                          <li key={index}>• {item}</li>
                        ))}
                      </ul>
                    )}
                    <div className="text-sm text-gray-500 mt-2">
                      예상 전달일 {selectedReward.deliveryDate || '미정'}
                    </div>
                  </div>
                  <Separator className="my-4" />
                  <div className="flex justify-between items-center">
                    <span className="font-medium">선물 금액</span>
                    <span className="font-bold">{baseAmount.toLocaleString()}원</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Additional Donation */}
            <div>
              <h2 className="text-lg font-bold mb-4">추가 후원금 (선택)</h2>
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <Label htmlFor="donation" className="font-medium">
                      후원금
                    </Label>
                    <div className="flex items-center gap-2 flex-1">
                      <Input
                        id="donation"
                        type="number"
                        value={additionalDonation}
                        onChange={(e) => setAdditionalDonation(e.target.value)}
                        placeholder="0"
                        className="text-right"
                      />
                      <span>원</span>
                    </div>
                  </div>
                  <div className="mt-4 flex items-center gap-2 text-sm text-red-500">
                    <Heart className="w-4 h-4" />
                    <span>추가 후원금으로 프로젝트를 더 응원할 수 있어요!</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Supporter Information */}
            <div>
              <h2 className="text-lg font-bold mb-4">후원자 정보</h2>
              <Card>
                <CardContent className="p-6 space-y-4">
                  <div>
                    <Label className="font-medium">연락처</Label>
                    <div className="mt-2 p-3 bg-black text-white rounded text-sm">████████████</div>
                  </div>
                  <div>
                    <Label className="font-medium">이메일</Label>
                    <div className="mt-2 p-3 bg-black text-white rounded text-sm">████████████████</div>
                  </div>
                  <div className="text-xs text-gray-500 space-y-1">
                    <div>* 입력 연락처와 이메일로 후원 관련 소식이 전달됩니다.</div>
                    <div>* 연락처 및 이메일 변경은 설정 {">"} 계정 설정에서 가능합니다.</div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Shipping Address */}
            <div>
              <h2 className="text-lg font-bold mb-4">배송지</h2>
              <Card>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="p-3 bg-black text-white rounded text-sm flex items-center justify-between">
                      <span>████████████████████████████</span>
                      <span className="bg-red-500 text-white px-2 py-1 rounded text-xs">기본</span>
                    </div>
                    <Button variant="outline" className="w-full bg-transparent">
                      변경
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Right Column - Summary */}
          <div className="space-y-6">
            {/* Final Amount */}
            <Card>
              <CardContent className="p-6">
                <div className="text-center mb-4">
                  <div className="text-red-500 font-medium mb-2">최종 후원 금액</div>
                  <div className="text-2xl font-bold">{totalAmount.toLocaleString()} 원</div>
                </div>

                <div className="text-xs text-gray-500 mb-6">
                  프로젝트 성공 시, 결제는 <span className="font-medium">{project.deadline}</span> 에 진행됩니다. 프로젝트가
                  무산되거나 중단된 경우, 예약된 결제는 자동으로 취소됩니다.
                </div>

                {/* Consent Checkboxes */}
                <div className="space-y-4 mb-6">
                  <div className="flex items-start gap-3">
                    <Checkbox
                      id="personal-info"
                      checked={personalInfoConsent}
                      onCheckedChange={setPersonalInfoConsent}
                    />
                    <div className="flex-1">
                      <Label htmlFor="personal-info" className="text-sm">
                        개인정보 제 3자 제공 동의
                      </Label>
                      <Button variant="link" className="p-0 h-auto text-blue-500 text-xs ml-2">
                        내용보기
                      </Button>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Checkbox id="terms" checked={termsConsent} onCheckedChange={setTermsConsent} />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="terms" className="text-sm">
                          후원 유의사항 확인
                        </Label>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setTermsExpanded(!termsExpanded)}
                          className="p-0 h-auto"
                        >
                          <span className="text-xs mr-1">닫기</span>
                          {termsExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                        </Button>
                      </div>

                      {termsExpanded && (
                        <div className="mt-2 text-xs text-gray-600 space-y-2">
                          <div>• 후원은 구매가 아닌 창의적인 계획에 자금을 지원하는 일입니다.</div>
                          <div className="text-gray-500">
                            텀블벅에서의 후원은 아직 실현되지 않은 프로젝트가 실현될 수 있도록 제작비를 후원하는
                            과정으로, 기존의 상품 구매와는 다른 의미를 가집니다. 따라서 일반적인 상품처럼 즉시 배송이나
                            교환/환불이 어려울 수 있습니다.
                          </div>
                          <div>• 프로젝트는 계획 변경 등 진행될 수 있습니다.</div>
                          <div className="text-gray-500">
                            예상을 뛰어넘는 펀딩 결과나 수 없는 외부적 요인에 의해서 제작 과정에서 계획이 지연,
                            변경되거나 무산될 수도 있습니다. 본 프로젝트를 완수할 책임과 권리는 창작자에게 있습니다.
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Support Button */}
                <Button
                  className="w-full bg-red-500 hover:bg-red-600 text-white py-3"
                  disabled={!personalInfoConsent || !termsConsent}
                  onClick={() => {
                    // 후원 정보를 서버로 전송
                    const supportData = {
                      projectNo: parseInt(projectNo),
                      rewardId: selectedReward.rewardId,
                      amount: totalAmount,
                      additionalDonation: additionalAmount,
                      personalInfoConsent,
                      termsConsent
                    };
                    console.log('후원 정보:', supportData);
                    // TODO: 실제 API 호출로 대체
                    alert('후원이 완료되었습니다!');
                  }}
                >
                  후원하기
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
