$hwp = New-Object -ComObject HWPFrame.HwpObject
$hwp.XHwpWindows.Item(0).Visible = $false
$hwp.Open("c:\Users\user\Documents\seostudio\2026.6.28 세종대왕 챗봇 만들기\이용약관 예시.hwp", "HWP", "forceopen:true")
$hwp.SaveAs("c:\Users\user\Documents\seostudio\2026.6.28 세종대왕 챗봇 만들기\terms_extract.txt", "TEXT")
$hwp.Quit()
