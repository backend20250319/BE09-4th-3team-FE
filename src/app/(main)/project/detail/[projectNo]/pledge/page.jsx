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
import { ChevronUp, ChevronDown, Heart, Package, Plus, Minus } from "lucide-react"
import Image from "next/image"
import PledgeHeader from "@/components/header/PledgeHeader"
import { useRouter } from "next/navigation"


export default function PledgePage() {
  const [additionalDonation, setAdditionalDonation] = useState("")
  const [personalInfoConsent, setPersonalInfoConsent] = useState(false)
  const [termsConsent, setTermsConsent] = useState(false)
  const [termsExpanded, setTermsExpanded] = useState(true)
  const [shippingAddress, setShippingAddress] = useState("")
  const [deliveryPhone, setDeliveryPhone] = useState("")
  const [recipientName, setRecipientName] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [personalInfoModalOpen, setPersonalInfoModalOpen] = useState(false)
  const [userInfo, setUserInfo] = useState(null)
  const [selectedRewards, setSelectedRewards] = useState([]) // 선택된 선물들

  const { projectNo } = useParams();
  const searchParams = useSearchParams();
  const rewardId = searchParams.get('rewardId'); // @deprecated - 단일 선물 선택용, 호환성 유지
  const cartId = searchParams.get('cartId'); // 장바구니용
  const [project, setProject] = useState(null);
  const router = useRouter();

  // 사용자 정보 가져오기
  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const token = sessionStorage.getItem('accessToken');
        if (!token) {
          alert('로그인이 필요합니다.');
          return;
        }

        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/register/user/me`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        setUserInfo(response.data);
      } catch (error) {
        console.error('사용자 정보 가져오기 실패:', error);
      }
    };

    fetchUserInfo();
  }, []);

  useEffect(() => {
    if (projectNo) {
      axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/project/${projectNo}`).then((res) => {
        setProject(res.data.data);
      });
    }
  }, [projectNo]);

  // SessionStorage에서 선택된 선물 정보 읽기 (cartId 기반)
  useEffect(() => {
    if (cartId) {
      const storedRewards = sessionStorage.getItem(`selectedRewards_${cartId}`);
      if (storedRewards) {
        try {
          const rewards = JSON.parse(storedRewards);
          setSelectedRewards(rewards);
          // sessionStorage.removeItem(`selectedRewards_${cartId}`); // 필요시 삭제
        } catch (error) {
          console.error('저장된 선물 정보 파싱 실패:', error);
        }
      }
    }
  }, [cartId]);

  // @deprecated - URL 파라미터로 전달된 단일 선물이 있으면 초기 선택 (호환성 유지)
  useEffect(() => {
    if (project && rewardId && selectedRewards.length === 0) {
      const reward = project.rewards?.find(r => r.id === parseInt(rewardId));
      if (reward) {
        setSelectedRewards([{ ...reward, quantity: 1 }]);
      }
    }
  }, [project, rewardId, selectedRewards.length]);

  if (!project) return <div>로딩 중...</div>;

  // 선택된 선물들의 총 금액 계산
  const selectedRewardsTotal = selectedRewards.reduce((sum, reward) => {
    return sum + (reward.amount * reward.quantity);
  }, 0);

  const additionalAmount = Number.parseInt(additionalDonation) || 0;
  const totalAmount = selectedRewardsTotal + additionalAmount;

  return (
    <div className="min-h-screen bg-gray-50">
      <PledgeHeader />

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Project Information */}
            <Card>
              <CardContent>
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

            {/* Selected Rewards Display */}
            <div>
              <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                <Package className="w-5 h-5" />
                선택한 선물
              </h2>
              
              {selectedRewards.length === 0 ? (
                <Card>
                  <CardContent>
                    <div className="text-center py-8 text-gray-500">
                      <Package className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                      <p>선택된 선물이 없습니다.</p>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <Card>
                  <CardContent>
                    <div className="space-y-3">
                      {selectedRewards.map((reward) => (
                        <div key={reward.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div className="flex-1">
                            <h4 className="font-medium text-gray-800">{reward.title}</h4>
                            <p className="text-sm text-gray-600">
                              {reward.amount.toLocaleString()}원 × {reward.quantity}개 = {(reward.amount * reward.quantity).toLocaleString()}원
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    <div className="mt-3 pt-3 border-t border-gray-200">
                      <div className="flex justify-between text-sm font-medium">
                        <span>선물 총액</span>
                        <span>{selectedRewardsTotal.toLocaleString()}원</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Additional Donation */}
            <div>
              <h2 className="text-lg font-bold mb-4">
                추가 후원금 <span className="text-gray-400">(선택)</span>
              </h2>
              <Card>
                <CardContent>
                  <div className="flex items-center gap-4">
                    <Label htmlFor="donation" className="font-medium">
                      후원금
                    </Label>
                    <div className="flex items-center gap-2 flex-1">
                      <Input
                        id="donation"
                        type="number"
                        min="0"
                        value={additionalDonation}
                        onChange={(e) => {
                          const value = e.target.value;
                          if (value === '' || parseInt(value) >= 0) {
                            setAdditionalDonation(value);
                          }
                        }}
                        placeholder="0"
                        className="text-right [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
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
                <CardContent>
                  <div className="flex items-center">
                    <Label className="font-medium w-20">연락처</Label>
                    <span className="text-gray-600 ml-4">{userInfo?.phone || '연락처 정보 없음'}</span>
                  </div>
                  <div className="flex items-center mt-2">
                    <Label className="font-medium w-20">이메일</Label>
                    <span className="text-gray-600 ml-4">{userInfo?.email || '이메일 정보 없음'}</span>
                  </div>
                  <div className="mt-4 text-xs text-gray-500 space-y-1">
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
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center gap-4">
                      <Label htmlFor="recipientName" className="font-medium w-24">수령인</Label>
                      <Input
                        id="recipientName"
                        value={recipientName}
                        onChange={(e) => setRecipientName(e.target.value)}
                        placeholder="수령인 이름을 입력하세요"
                        className=""
                      />
                    </div>
                    <div className="flex items-center gap-4">
                      <Label htmlFor="deliveryPhone" className="font-medium w-24">연락처</Label>
                      <Input
                        id="deliveryPhone"
                        value={deliveryPhone}
                        onChange={(e) => setDeliveryPhone(e.target.value)}
                        placeholder="배송 연락처를 입력하세요"
                        className=""
                      />
                    </div>
                    <div className="flex items-center gap-4">
                      <Label htmlFor="shippingAddress" className="font-medium w-24">배송지 주소</Label>
                      <Input
                        id="shippingAddress"
                        value={shippingAddress}
                        onChange={(e) => setShippingAddress(e.target.value)}
                        placeholder="배송지 주소를 입력하세요"
                        className=""
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Right Column - Summary */}
          <div className="space-y-6">
            {/* Final Amount */}
            <Card>
              <CardContent>
                <div className="text-center mb-4">
                  <div className="text-red-500 font-medium mb-2">최종 후원 금액</div>
                  <div className="text-2xl font-bold">{totalAmount.toLocaleString()} 원</div>
                </div>

                {/* Selected Rewards Summary */}
                {selectedRewards.length > 0 && (
                  <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                    <div className="text-sm font-medium mb-2">선택한 선물</div>
                    <div className="space-y-1">
                      {selectedRewards.map((reward) => (
                        <div key={reward.id} className="flex justify-between text-sm">
                          <span className="text-gray-600">{reward.title} × {reward.quantity}</span>
                          <span>{(reward.amount * reward.quantity).toLocaleString()}원</span>
                        </div>
                      ))}
                    </div>
                    <Separator className="my-2" />
                    <div className="flex justify-between text-sm font-medium">
                      <span>선물 총액</span>
                      <span>{selectedRewardsTotal.toLocaleString()}원</span>
                    </div>
                    {additionalAmount > 0 && (
                      <>
                        <div className="flex justify-between text-sm">
                          <span className="text-blue-600">추가 후원금</span>
                          <span className="text-blue-600">+{additionalAmount.toLocaleString()}원</span>
                        </div>
                        <Separator className="my-2" />
                      </>
                    )}
                  </div>
                )}

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
                      <div className="flex items-center justify-between">
                        <Label htmlFor="personal-info" className="text-sm">
                          개인정보 제 3자 제공 동의
                        </Label>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="p-0 h-auto text-blue-500 text-xs"
                          onClick={() => setPersonalInfoModalOpen(true)}
                        >
                          내용보기
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Checkbox 
                      id="terms" 
                      checked={termsConsent} 
                      onCheckedChange={(checked) => {
                        setTermsConsent(checked);
                        if (checked) {
                          setTermsExpanded(false);
                        }
                      }} 
                    />
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
                          <span className="text-xs mr-1">{termsExpanded ? "닫기" : "열기"}</span>
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
                  disabled={!personalInfoConsent || !termsConsent || !recipientName || !deliveryPhone || !shippingAddress || isSubmitting || selectedRewards.length === 0}
                  onClick={async () => {
                    if (selectedRewards.length === 0) {
                      alert('최소 1개 이상의 선물를 선택해주세요.');
                      return;
                    }

                    if (!recipientName || !deliveryPhone || !shippingAddress) {
                      alert('배송 정보를 모두 입력해주세요.');
                      return;
                    }

                    setIsSubmitting(true);
                    
                    try {
                      const pledgeData = {
                        projectNo: parseInt(projectNo),
                        rewards: selectedRewards.map(reward => ({
                          rewardNo: reward.id,
                          quantity: reward.quantity
                        })),
                        additionalAmount: additionalAmount,
                        deliveryAddress: shippingAddress,
                        deliveryPhone: deliveryPhone,
                        recipientName: recipientName
                      };

                      const token = sessionStorage.getItem('accessToken');
                      
                      if (!token) {
                        alert('로그인이 필요합니다.');
                        return;
                      }

                      const response = await axios.post(
                        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/pledge`,
                        pledgeData,
                        {
                          headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${token}`
                          }
                        }
                      );

                      if (response.status === 200) {
                        // alert('후원이 성공적으로 완료되었습니다!');
                        router.push(`/project/detail/${projectNo}/pledge/completed/${response.data.pledgeNo}`);
                      }
                    } catch (error) {
                      console.error('후원 요청 실패:', error);
                      if (error.response?.data?.message) {
                        alert(`후원 실패: ${error.response.data.message}`);
                      } else {
                        alert('후원 처리 중 오류가 발생했습니다. 다시 시도해주세요.');
                      }
                    } finally {
                      setIsSubmitting(false);
                    }
                  }}
                >
                  {isSubmitting ? '처리 중...' : '후원하기'}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Personal Info Modal */}
      {personalInfoModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold">개인정보 제 3자 제공 동의</h2>
                <button
                  onClick={() => setPersonalInfoModalOpen(false)}
                  className="text-gray-500 hover:text-gray-700 text-2xl"
                >
                  ×
                </button>
              </div>

              <div className="space-y-6">
                <p className="text-sm text-gray-700 leading-relaxed">
                  회원의 개인정보는 당사의 개인정보 취급방침에 따라 안전하게 보호됩니다. 회사는 이용자들의 개인정보를
                  개인정보 취급방침의 "제 2조 수집하는 개인정보의 항목, 수집방법 및 이용목적"에서 고지한 범위 내에서
                  사용하며, 이용자의 사전 동의 없이는 동 범위를 초과하여 이용하거나 원칙적으로 이용자의 개인정보를
                  외부에 공개하지 않습니다.
                </p>

                <div className="border border-gray-200 rounded-lg overflow-hidden">
                  <table className="w-full text-sm">
                    <tbody>
                      <tr className="border-b border-gray-200">
                        <td className="bg-gray-50 p-4 font-medium w-1/3">제공받는 자</td>
                        <td className="p-4">후원 프로젝트의 창작자</td>
                      </tr>
                      <tr className="border-b border-gray-200">
                        <td className="bg-gray-50 p-4 font-medium">제공 목적</td>
                        <td className="p-4">선물 전달 및 배송과 관련된 상담 및 민원처리</td>
                      </tr>
                      <tr className="border-b border-gray-200">
                        <td className="bg-gray-50 p-4 font-medium">제공 정보</td>
                        <td className="p-4">수취인 성명, 휴대전화번호, 배송 주소</td>
                      </tr>
                      <tr>
                        <td className="bg-gray-50 p-4 font-medium">보유 및 이용기간</td>
                        <td className="p-4">
                          재화 또는 서비스의 제공이 완료된 즉시 파기(단, 관계법령에 정해진 규정에 따라 법정기간 동안
                          보관)
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div className="text-sm text-gray-600">
                  <p className="font-medium mb-2">* 동의 거부권 등에 대한 고지</p>
                  <p>
                    개인정보 제공은 서비스 이용을 위해 꼭 필요합니다. 개인정보 제공을 거부하실 수 있으나, 이 경우 서비스
                    이용이 제한될 수 있습니다.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
