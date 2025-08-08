import { useState, useCallback } from "react";
import { debounce } from "lodash";
import { 
  Accordion, 
  Button, 
  Badge, 
  Checkbox, 
  Skeleton, 
  Slider, 
  Switch, 
  Textarea, 
  Tab, 
  Label,
  Input, 
  Card,
  Sidebar,
} from "@plug/ui";
import type { ButtonProps } from "@plug/ui";
import { MenuIcon, NoticeIcon, HomeIcon } from "@plug/ui/icons";


// 제품 데이터 샘플
const products = [
  {
    id: 1,
    name: "스마트 센서",
    price: 120000,
    category: "전자기기",
    description: "고성능 스마트 센서입니다.",
    stock: 15
  },
  {
    id: 2,
    name: "공기질 모니터",
    price: 89000,
    category: "환경",
    description: "실내 공기질을 모니터링하는 장치입니다.",
    stock: 8
  },
  {
    id: 3,
    name: "데이터 로거",
    price: 150000,
    category: "측정장비",
    description: "다양한 환경 데이터를 수집하고 저장하는 장치입니다.",
    stock: 12
  }
];

function DesignSystem() {

  const [inputTextValue, setInputTextValue] = useState<string>('');
  const [inputTextInvalid, setInputTextInvalid] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);

  const [textareaValue, setTextareaValue] = useState<string>('');
  const [textareaInvalid, setTextareaInvalid] = useState<boolean>(false);

  const [isSwitchChecked, setIsSwitchChecked] = useState<boolean>(false);

  const [activeTab, setActiveTab] = useState<string>('tab1');

  const [sliderValue, setSliderValue] = useState<number>(20);

  const inputTextDebounce = useCallback(
    debounce((value: string) => {
      setInputTextInvalid(value.length <= 10);
      console.log(value);
    }, 300),
    []
  );

  const inputTextOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputTextValue(value);
    inputTextDebounce(value);
    setError(value.length < 8);
  }
  
  const textareaDebounced = useCallback(
    debounce((value: string) => {
      setTextareaInvalid(value.length <= 10);
      console.log(value);
    }, 500),
    []
  );
  
  const textareaOnChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setTextareaValue(value);
    textareaDebounced(value);
  };

  const SwitchOnChange = (checked: boolean) => {
    setIsSwitchChecked(checked);
    console.log(checked);
  };

  const tabOnChange = (value: string) => {
    setActiveTab(value);
  };

  const SliderChangeValue = (value: number) => {
      setSliderValue(value);
  };

  const buttonProps: ButtonProps = {
    variant: "default",
    color: "primary",
    size: "medium",
    isLoading: false,
    children: "버튼",
    onClick: () => {
      console.log("버튼 클릭");
    }
  }


  return (
    <div className="flex gap-10">
      <Sidebar>
        <Sidebar.Menu
            items={[
                {
                    title: "홈",
                    beforeNavigate: () => {
                        console.log('beforeNavigate 실행')
                    },
                    link: '/3d-test',
                    icon: <HomeIcon />,
                    toggleable: false,
                    className: 'text-red-600'
                },
                {
                    title: "설정",
                    submenu: [
                        {
                            title: "프로필",
                            link: '/3d-test',
                            className: 'text-red-600'
                        },
                        {
                            title: "알림",
                            link: '/3d-test',
                        },
                    ],
                },
            ]}
          />
        </Sidebar>
      <div>
        <h2 className="text-xl font-bold mt-8 mb-4">Accordion 컴포넌트 예제</h2>
        <Accordion collapsible={false}>
          <Accordion.Item value="item-1">
            <Accordion.Trigger>첫 번째 항목</Accordion.Trigger>
            <Accordion.Content>
              첫 번째 항목의 내용입니다. 
            </Accordion.Content>
          </Accordion.Item>
          <Accordion.Item value="item-2">
            <Accordion.Trigger>두 번째 항목</Accordion.Trigger>
            <Accordion.Content>
              두 번째 항목의 내용입니다.
            </Accordion.Content>
          </Accordion.Item>
          <Accordion.Item value="item-3">
            <Accordion.Trigger>세 번째 항목</Accordion.Trigger>
            <Accordion.Content>
              세 번째 항목의 내용입니다.
            </Accordion.Content>
          </Accordion.Item>
        </Accordion>
        <h2 className="text-xl font-bold mt-8 mb-4">Button 컴포넌트 예제</h2>
        <Button variant="outline" color="primary">
          <MenuIcon />버튼
        </Button>
        <h2 className="text-xl font-bold mt-8 mb-4">Time 컴포넌트 예제</h2>
        <p className="flex gap-2 items-center font-bold text-sm">시간</p>
        <h2 className="text-xl font-bold mt-8 mb-4">Badge 컴포넌트 예제</h2>
        <Badge>뱃지</Badge>
        <h2 className="text-xl font-bold mt-8 mb-4">Checkbox 컴포넌트 예제</h2>
        <Checkbox label="체크박스" color="primary" type="circle" disabled/>
        <h2 className="text-xl font-bold mt-8 mb-4">Skeleton 컴포넌트 예제</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Skeleton variant="circle" className="w-[180px] h-[180px]"></Skeleton>
          <Skeleton variant="rectangle" className="w-[200px] h-[100px]"></Skeleton>
          <div className="flex flex-col gap-2 w-[200px]">
            <Skeleton variant="text"></Skeleton>
            <Skeleton variant="text"></Skeleton>
            <Skeleton variant="text"></Skeleton>
          </div>
        </div>
        <h2 className="text-xl font-bold mt-8 mb-4">Slider 컴포넌트 예제</h2>
        <Slider className="w-[200px]" color="secondary" size="medium" value={sliderValue} onValueChange={SliderChangeValue}>
            <Slider.Track>
                <Slider.Thumb />
            </Slider.Track>
            <Slider.Range />
        </Slider>
        <h2 className="text-xl font-bold mt-8 mb-4">Switch 컴포넌트 예제</h2>
        <Switch checked={isSwitchChecked} onChange={SwitchOnChange} size="medium" color="secondary"/>
        <Switch label="라벨이 노출됩니다."/>
        <h2 className="text-xl font-bold mt-8 mb-4">Textarea 컴포넌트 예제</h2>
        <Textarea aria-label="textarea 입력창" value={textareaValue} onChange={textareaOnChange} resize="both" placeholder="텍스트를 입력하세요." invalid={textareaInvalid} />
        <h2 className="text-xl font-bold mt-8 mb-4">Tab 컴포넌트 예제</h2>
        <Tab className="w-100" value={activeTab} onValueChange={tabOnChange}>
            <Tab.List>
                <Tab.Trigger value="tab1">첫번째 탭</Tab.Trigger>
                <Tab.Trigger value="tab2">두번째 탭</Tab.Trigger>
            </Tab.List>
            <Tab.Content value="tab1">첫번째 콘텐츠 영역</Tab.Content>
            <Tab.Content value="tab2">두번째 콘텐츠 영역</Tab.Content>
        </Tab>
        <h2 className="text-xl font-bold mt-8 mb-4">Label 컴포넌트 예제</h2>
        <div className="flex gap-1 items-center">
          <Label htmlFor="label-id" required>라벨명</Label>
          <Input.Text id="label-id" placeholder="텍스트를 입력하세요" />
        </div>
        <h2 className="text-xl font-bold mt-8 mb-4">Input 컴포넌트 예제</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Input 단독 사용 예제 */}
          <Input.Password placeholder="텍스트를 입력하세요." value={inputTextValue} onChange={inputTextOnChange} invalid={inputTextInvalid} />
          <Input.Text placeholder="텍스트를 입력하세요." value={inputTextValue} onChange={inputTextOnChange} invalid={inputTextInvalid} iconPosition="leading" iconSvg={NoticeIcon} />
          {/* Input 묶음 사용 Input Box 예제 */}
          <Input.Box> 
            <Input.Label>라벨</Input.Label>
            <Input.Text placeholder="텍스트를 입력하세요." value={inputTextValue} onChange={inputTextOnChange} invalid={inputTextInvalid} iconPosition="leading" iconSvg={NoticeIcon} />
            <Input.HelperText error={error}>
              {inputTextInvalid ? "비밀번호는 8자 이상이어야 합니다." : "안전한 비밀번호를 입력하세요."}
            </Input.HelperText>
          </Input.Box>
          <Input.Box>
            <Input.Label>라벨</Input.Label>
            <Input.Password placeholder="텍스트를 입력하세요." value={inputTextValue} onChange={inputTextOnChange} invalid={inputTextInvalid} />
          </Input.Box>
        </div>
        <h2 className="text-xl font-bold mt-8 mb-4">Card 컴포넌트 예제 (합성 패턴)</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* 기본 카드 예제 */}
          <Card>
            <Card.Header>
              <Card.Title>기본 카드</Card.Title>
              <Card.Description>카드 설명이 여기에 들어갑니다.</Card.Description>
            </Card.Header>
            <Card.Content>
              <p>카드 내용이 여기에 들어갑니다. 다양한 컨텐츠를 포함할 수 있습니다.</p>
            </Card.Content>
            <Card.Footer>
              <Button {...buttonProps}>확인</Button>
              <Button variant="outline">취소</Button>
            </Card.Footer>
          </Card>
          
          {/* 닫기 버튼이 있는 카드 */}
          <Card closable onClose={() => alert('카드가 닫혔습니다.')}>
            <Card.Header>
              <Card.Title>닫기 버튼이 있는 카드</Card.Title>
            </Card.Header>
            <Card.Content>
              <p>오른쪽 상단의 X 버튼을 클릭하여 이 카드를 닫을 수 있습니다.</p>
            </Card.Content>
          </Card>
          
          {/* 제품 정보 카드 */}
          <Card className="bg-gray-50">
            <Card.Header>
              <Card.Title>제품 정보</Card.Title>
            </Card.Header>
            <Card.Content>
              {products.length > 0 && (
                <div>
                  <h4 className="font-medium">{products[0].name}</h4>
                  <p className="text-gray-600 mt-1">가격: {products[0].price.toLocaleString()}원</p>
                  <Badge color="primary" className="mt-2">{products[0].category}</Badge>
                </div>
              )}
            </Card.Content>
            <Card.Footer>
              <Button variant="default" color="primary">구매하기</Button>
            </Card.Footer>
          </Card>
          
          {/* 커스텀 스타일 카드 */}
          <Card className="bg-blue-50 border-blue-200">
            <Card.Header className="border-b border-blue-100">
              <Card.Title className="text-blue-800">커스텀 스타일 카드</Card.Title>
            </Card.Header>
            <Card.Content>
              <p>각 컴포넌트에 className을 전달하여 스타일을 커스터마이징할 수 있습니다.</p>
            </Card.Content>
            <Card.Footer className="justify-end">
              <Button variant="outline" color="primary">자세히 보기</Button>
            </Card.Footer>
          </Card>
        </div>
        
          <h2 className="text-2xl font-bold mb-6">카드 컴포넌트 샘플</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
            {/* 제품 카드 목록 */}
            {products.map((product) => (
              <Card key={product.id} className="h-full">
                <Card.Header>
                  <Card.Title>{product.name}</Card.Title>
                  <Card.Description>
                    <Badge color="primary" className="mt-1">{product.category}</Badge>
                  </Card.Description>
                </Card.Header>
                <Card.Content>
                  <p className="text-gray-700 mb-2">{product.description}</p>
                  <p className="text-lg font-semibold text-primary-600">{product.price.toLocaleString()}원</p>
                  <p className="text-sm text-gray-500 mt-1">재고: {product.stock}개</p>
                </Card.Content>
                <Card.Footer>
                  <Button variant="default" color="primary" className="w-full">
                    장바구니에 추가
                  </Button>
                </Card.Footer>
              </Card>
            ))}
          </div>
          
          <h3 className="text-xl font-bold mb-4">다양한 카드 스타일</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
            {/* 알림 카드 */}
            <Card className="bg-blue-50 border-blue-200">
              <Card.Header className="pb-2">
                <Card.Title className="text-blue-800 flex items-center">
                  <span className="w-5 h-5 mr-2 flex items-center justify-center">
                    <NoticeIcon />
                  </span>
                  알림
                </Card.Title>
              </Card.Header>
              <Card.Content>
                <p className="text-blue-700">시스템 점검이 예정되어 있습니다. 2023년 12월 15일 오후 11시부터 오전 2시까지 서비스 이용이 제한될 수 있습니다.</p>
              </Card.Content>
              <Card.Footer className="border-t border-blue-100 pt-3">
                <p className="text-blue-600 text-sm">2023-12-10 09:00:00</p>
              </Card.Footer>
            </Card>
            
            <Card className="bg-gray-50">
              <Card.Header>
                <Card.Title>월간 통계</Card.Title>
                <Card.Description>2023년 11월</Card.Description>
              </Card.Header>
              <Card.Content>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">총 방문자</p>
                    <p className="text-2xl font-bold">1,234</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">신규 가입자</p>
                    <p className="text-2xl font-bold">256</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">총 판매액</p>
                    <p className="text-2xl font-bold">₩8.2M</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">평균 체류시간</p>
                    <p className="text-2xl font-bold">4.5분</p>
                  </div>
                </div>
              </Card.Content>
            </Card>
          </div>
          
          <h3 className="text-xl font-bold mb-4">인터랙티브 카드</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* 닫기 버튼이 있는 카드 */}
            <Card closable onClose={() => alert('카드가 닫혔습니다.')}>
              <Card.Header>
                <Card.Title>닫기 가능한 카드</Card.Title>
              </Card.Header>
              <Card.Content>
                <p>오른쪽 상단의 X 버튼을 클릭하여 이 카드를 닫을 수 있습니다.</p>
              </Card.Content>
            </Card>
            
            {/* 호버 효과가 있는 카드 */}
            <Card className="transition-all duration-300 hover:shadow-lg hover:translate-y-[-4px] cursor-pointer">
              <Card.Header>
                <Card.Title>호버 효과 카드</Card.Title>
              </Card.Header>
              <Card.Content>
                <p>이 카드에 마우스를 올리면 그림자와 위치 효과가 적용됩니다.</p>
              </Card.Content>
              <Card.Footer>
                <Button variant="outline" color="primary" className="w-full">자세히 보기</Button>
              </Card.Footer>
            </Card>
            
            {/* 테두리 강조 카드 */}
            <Card className="border-2 border-primary-500">
              <Card.Header>
                <Card.Title className="text-primary-700">강조 테두리 카드</Card.Title>
              </Card.Header>
              <Card.Content>
                <p>중요한 정보를 강조하기 위해 테두리를 두껍게 표시할 수 있습니다.</p>
              </Card.Content>
              <Card.Footer>
                <Button variant="default" color="primary" className="w-full">확인</Button>
              </Card.Footer>
            </Card>
          </div>
      </div>
    </div>
  )
}

export default DesignSystem 