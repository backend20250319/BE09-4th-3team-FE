"use client";
import { useEffect, useState } from "react";
import { getDday } from "@/components/utils/dday";
import { Asterisk, CircleAlert, CircleQuestionMark } from "lucide-react";
import { numberWithCommas } from "@/components/utils/number";

// 목표금액 계산
const getFees = (amount) => {
  const num = parseInt(amount.toString().replace(/[^0-9]/g, ""), 10) || 0;

  const pgFee = Math.floor(num * 0.033); // 3.3%
  const platformFee = Math.floor(num * 0.055); // 5.5%
  const totalFee = pgFee + platformFee;
  const estimatedReceive = num - totalFee;

  return {
    pgFee,
    platformFee,
    totalFee,
    estimatedReceive,
  };
};

export default function Section02({
  startLine,
  setStartLine,
  deadLine,
  setDeadLine,
  accountNumber,
  setAccountNumber,
  goalAmount,
  setGoalAmount,
  validationMessage,
  setValidationMessage,
}) {
  const { pgFee, platformFee, totalFee, estimatedReceive } = getFees(goalAmount);
  const [duration, setDuration] = useState("날짜를 선택해 주세요.");

  useEffect(() => {
    if (startLine && deadLine) {
      setDuration(`${getDday(startLine, deadLine)}`);
    } else {
      setDuration("날짜를 선택해 주세요.");
    }
  }, [startLine, deadLine]);

  const handleGoalAmountChange = (e) => {
    let rawValue = e.target.value.replace(/[^0-9]/g, ""); // 숫자만 추출

    // 최대 자리수 제한 (10자리: 9999999999)
    if (rawValue.length > 10) {
      rawValue = rawValue.slice(0, 10);
    }

    const numericValue = parseInt(rawValue || "0", 10);

    // 유효성 검사 메시지
    if (numericValue < 500000) {
      setValidationMessage("50만원 이상의 금액을 입력해주세요.");
    } else if (numericValue > 9999999999) {
      setValidationMessage("9,999,999,999원 이하인 금액을 입력해주세요.");
    } else {
      setValidationMessage("");
    }

    setGoalAmount(rawValue);
  };

  return (
    <section>
      {/* 목표 금액 */}
      <div className="space-y-1 flex justify-between pb-12 mb-14 border-b border-[#ddd]">
        <div className=" w-[351px]">
          <h2 className="font-bold mb-3">목표 금액</h2>
          <p className="text-[#6d6d6d] font-normal text-sm">프로젝트를 완수하기 위해 필요한 금액을 설정해주세요.</p>
          <div className="bg-[#fff2f3] rounded-sm px-6 py-5  mt-[18px]">
            <span className="flex items-center text-xs font-bold text-[#e53c41] leading-[120%]">
              <CircleAlert size={13.5} className="mr-2" />
              목표 금액 설정 시 꼭 알아두세요!
            </span>
            <ul className="mt-2 list-disc">
              <li className="ml-3.5 mb-[5px] whitespace-pre-wrap text-xs leading-[150%] text-[#545454]">
                종료일까지 목표금액을 달성하지 못하면 후원자 결제가 진행되지 않습니다.
              </li>
              <li className="ml-3.5 mb-[5px] whitespace-pre-wrap text-xs leading-[150%] text-[#545454]">
                후원 취소 및 결제 누락을 대비해 10% 이상 초과 달성을 목표로 해주세요.
              </li>
              <li className="ml-3.5 mb-[5px] whitespace-pre-wrap text-xs leading-[150%] text-[#545454]">
                제작비, 선물 배송비, 인건비, 예비 비용 등을 함께 고려해주세요.
              </li>
            </ul>
          </div>
        </div>
        <div className="w-[630px]">
          <div className="bg-white border border-[#eaeaea] pt-8 pb-6 pr-6 pl-6 w-full">
            <div className="relative">
              <div className="flex items-center mb-2">
                <p className="text-[12px] leading-[18px] text-[#3d3d3d] font-bold">목표금액</p>
                <Asterisk color="#ff0000" strokeWidth={2} size={13} />
              </div>
              <input
                id="goalAmount"
                type="text"
                value={numberWithCommas(goalAmount)}
                required
                min={500000}
                autoCapitalize="off"
                autoComplete="off"
                onChange={handleGoalAmountChange}
                placeholder="50만원 이상의 금액을 입력해 주세요"
                className="w-full border px-3 py-2 rounded pr-7 text-right placeholder:text-sm"
              />
              <span
                className={`absolute right-3 ${
                  validationMessage ? "top-[50%]" : "top-[68%]"
                } -translate-y-1/2 text-gray-500 text-sm pointer-events-none`}
              >
                원
              </span>
              {validationMessage && <p className="text-red-500 text-xs mt-1">{validationMessage}</p>}
            </div>
            <div className="bg-[#fcfcfc] rounded-[4px] px-[15px] pt-[25px] pb-[22px]">
              <div className="flex justify-between text-[#3d3d3d] text-xs reading-[19px] pb-4 mb-[11px] border-b border-[#eaeaea]">
                <span>목표 금액 달성 시 예상 수령액</span>
                <em className="not-italic text-[#f86453] text-[18px] leading-[27px] tracking-[-0.02em] font-semibold">
                  {estimatedReceive.toLocaleString()}원
                </em>
              </div>
              <div className="flex justify-between text-[#9e9e9e] text-xs leading-[19px]">
                총 수수료<em>{totalFee.toLocaleString()}원</em>
              </div>
              <div className="flex justify-between text-[#9e9e9e] text-xs leading-[19px]">
                결제대행 수수료 (총 결제 성공 금액의 3% + VAT)<em>{pgFee.toLocaleString()}원</em>
              </div>
              <div className="flex justify-between text-[#9e9e9e] text-xs leading-[19px]">
                Basic 요금제 수수료 (총 결제 성공 금액의 5% + VAT)<em>{platformFee.toLocaleString()}원</em>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 시작일 / 종료일 */}
      <div className="space-y-1 flex justify-between pb-12 mb-14 border-b border-[#ddd]">
        <div className=" w-[351px]">
          <h2 className="font-bold mb-3">일정</h2>
          <p className="text-[#6d6d6d] font-normal text-sm">
            설정한 일시가 되면 프로젝트가 자동 시작됩니다. 프로젝트 시작 전까지 날짜를 변경할 수 있고, 즉시 프로젝트를
            시작할 수도 있습니다.
          </p>
        </div>
        <div className="w-[630px]">
          <ol>
            <li className="flex gap-5 pb-[38px] pl-[18px] relative before:content-[''] before:absolute before:top-[4px] before:left-0 before:z-[1] before:block before:w-[9px] before:h-[9px] before:rounded-[4px] before:bg-white before:border-[3px] before:border-black after:content-[''] after:absolute after:top-[4px] after:left-[4px] after:h-full after:border-l after:border-[#e4e4e4]">
              <div className="w-[50%]">
                <div className="flex items-center mb-2">
                  <p className="text-[12px] leading-[18px] text-[#3d3d3d] font-bold">시작일</p>
                  <Asterisk color="#ff0000" strokeWidth={2} size={13} />
                </div>
                <input
                  id="startLine"
                  type="date"
                  value={startLine}
                  onChange={(e) => setStartLine(e.target.value)}
                  min={new Date().toISOString().split("T")[0]} // ✅ 오늘 이전 선택 불가
                  className="w-full border px-3 py-2 rounded text-sm"
                />
              </div>
              <div className="w-[50%]">
                <div className="flex items-center mb-2">
                  <p className="text-[12px] leading-[18px] text-[#3d3d3d] font-bold">종료일</p>
                  <Asterisk color="#ff0000" strokeWidth={2} size={13} />
                </div>
                <input
                  id="deadLine"
                  type="date"
                  value={deadLine}
                  onChange={(e) => setDeadLine(e.target.value)}
                  min={startLine || new Date().toISOString().split("T")[0]} // ✅ 시작일 또는 오늘 이후만
                  className="w-full border px-3 py-2 rounded text-sm"
                />
              </div>
            </li>
            <li className="flex gap-5 pb-[38px] pl-[18px] relative before:content-[''] before:absolute before:top-[4px] before:left-0 before:z-[1] before:block before:w-[9px] before:h-[9px] before:rounded-[4px] before:bg-white before:border-[3px] before:border-black after:content-[''] after:absolute after:top-[4px] after:left-[4px] after:h-full after:border-l after:border-[#e4e4e4] flex-col">
              <p className="text-[12px] font-semibold text-[#3d3d3d]">프로젝트 기간</p>
              <span className="text-xs text-gray-500">
                {startLine && deadLine ? `${duration}일` : "날짜를 선택해 주세요."}
              </span>
            </li>
            <li className="flex flex-col gap-5 pb-[38px] pl-[18px] relative before:content-[''] before:absolute before:top-[4px] before:left-0 before:z-[1] before:block before:w-[9px] before:h-[9px] before:rounded-[4px] before:bg-white before:border-[3px] before:border-black after:content-[''] after:absolute after:top-[4px] after:left-[4px] after:h-full after:border-l after:border-[#e4e4e4]">
              <p className="text-[12px] font-semibold text-[#3d3d3d] flex items-center">
                후원자 결제 종료
                <CircleQuestionMark color="#ff0000" size={16} className="ml-1" />
              </p>
              <span className="text-xs text-gray-500">종료일 다음 날부터 7일</span>
            </li>
            <li className="flex flex-col gap-5 pb-[38px] pl-[18px] relative before:content-[''] before:absolute before:top-[4px] before:left-0 before:z-[1] before:block before:w-[9px] before:h-[9px] before:rounded-[4px] before:bg-white before:border-[3px] before:border-black">
              <p className="text-[12px] font-semibold text-[#3d3d3d] flex">
                정산일
                <CircleQuestionMark color="#ff0000" size={16} className="ml-1" />
              </p>
              <span className="text-xs text-gray-500"> 후원자 결제 종료 다음 날부터 7영업일</span>
            </li>
          </ol>
        </div>
      </div>

      {/* 계좌번호 */}
      <div className="space-y-1 flex justify-between pb-12 mb-14 border-b border-[#ddd]">
        <div className=" w-[351px]">
          <h2 className="font-bold mb-3">입금 계좌</h2>
          <p className="text-[#6d6d6d] font-normal text-sm">
            후원금을 전달받을 계좌를 등록해주세요. 법인사업자는 법인계좌로만 정산받을 수 있습니다.
          </p>
        </div>
        <div className="w-[630px]">
          <div className="flex items-center mb-2">
            <p className="text-[12px] leading-[18px] text-[#3d3d3d] font-bold">계좌번호</p>
            <Asterisk color="#ff0000" strokeWidth={2} size={13} />
          </div>
          <input
            id="accountNumber"
            type="text"
            value={accountNumber}
            placeholder="- 기호를 포함하여 주세요."
            onChange={(e) => setAccountNumber(e.target.value)}
            className="w-full border px-3 py-2 rounded placeholder:text-sm"
          />
        </div>
      </div>
    </section>
  );
}
