import pyautogui
import keyboard
import time


x1, y1, width1, height1 = 100, 100, 800, 600  # definiert das begrenzende Rechteck für das erste Bild
buy_region = (675, 330, 100, 100) #1. 677 234  2. Point(x=1452, y=339) 



x1, y1, width1, height1 = 100, 100, 800, 600  # definiert das begrenzende Rechteck für das erste Bild
notJoinable_region = (1297, 738, 700, 330) #  (x=1297, y=738)(x=1906, y=1057)


#x2, y2, width2, height2 = 1771, 488, 100, 60  # definiert das begrenzende Rechteck für das zweite Bild
#withdrawproceed_region = (x2, y2, width2, height2) 
buy = None
withdraw = None
unstable = None
notJoinable = 0
notJoinableSearch = None
highestPriceFirst = None
lowestPriceFirst = None
tradeWithSamePerson = None
click = 0
buy_x = 622
buy_y = 743

while True:
    buy = pyautogui.locateOnScreen("C:\\Users\\craft\\Desktop\\Python\\Files\\blitz2.png",region=buy_region,  confidence = 0.8)
    unstable = pyautogui.locateOnScreen("C:\\Users\\craft\\Desktop\\Python\\Files\\unstableitem.png",region=buy_region, confidence = 0.8)
    notJoinable += 1
    click += 1
    blitzorange = pyautogui.locateOnScreen("C:\\Users\\craft\\Desktop\\Python\\Files\\blitzorange.png",region=buy_region, confidence = 0.8)


    if buy is not None:
        pyautogui.moveTo(buy_x, buy_y)
        #pyautogui.moveRel(-130, 200) #Point(x=1116, y=430) to (x=1028, y=248)
        pyautogui.click()
        pyautogui.moveTo(1666, 362)
        pyautogui.click() 
        buy = None
        #withdraw = 1


    if unstable is not None:
        pyautogui.moveTo(buy_x, buy_y)
        #pyautogui.moveRel(-130, 200) #Point(x=1116, y=430) to (x=1028, y=248)
        pyautogui.click()
        pyautogui.moveTo(1666, 362)
        pyautogui.click() 
        unstable = None
        #withdraw = 1

    if blitzorange is not None:
        pyautogui.moveTo(buy_x, buy_y)
        #pyautogui.moveRel(-130, 200) #Point(x=1116, y=430) to (x=1028, y=248)
        pyautogui.click()
        pyautogui.moveTo(1666, 362)
        pyautogui.click() 
        blitzorange = None
        #withdraw = 1    


    #if withdraw is not None:
    #        
    #    pyautogui.moveTo(1666, 362)#(x=1666, y=362)
    #    pyautogui.click()    
    #    withdraw = None


    if notJoinable >= 10:
        notJoinableSearch = pyautogui.locateOnScreen("C:\\Users\\craft\\Desktop\\Python\\Files\\TradeNotJoinable.png", region=notJoinable_region)
        tradeWithSamePerson = pyautogui.locateOnScreen("C:\\Users\\craft\\Desktop\\Python\\Files\\activeTrade.png", confidence = 0.8)

        if notJoinableSearch is not None:


            pyautogui.moveTo(x=1177, y=272)
            pyautogui.click()
            time.sleep(2)
            lowestPriceFirst = pyautogui.locateOnScreen("C:\\Users\\craft\\Desktop\\Python\\Files\\lowestPriceFirst.png")
            pyautogui.moveTo(lowestPriceFirst)
            pyautogui.click()
            time.sleep(1)
            pyautogui.moveTo(x=1177, y=272)
            pyautogui.click()
            time.sleep(1)
            highestPriceFirst = pyautogui.locateOnScreen("C:\\Users\\craft\\Desktop\\Python\\Files\\highestPriceFirst.png")
            pyautogui.moveTo(highestPriceFirst)
            pyautogui.click()
            notJoinabelSearch = None
            highestPriceFirst = None
            lowestPriceFirst = None

        if tradeWithSamePerson is not None:
            time.sleep(20)

        notJoinable = 0
        notJoinableSearch = None
        tradewithSamePerson = None      

    #if blitzorange is not None:
    #    pyautogui.moveTo(unstable)
    #    pyautogui.moveRel(-130, 200) #Point(x=1116, y=430) to (x=1028, y=248)
    #    pyautogui.click()
    #    unstable = None
    #    withdraw = 1

    if click >= 10:
        pyautogui.moveTo(620, 801)#x=678, y=684)
        pyautogui.click()
        click = 0
