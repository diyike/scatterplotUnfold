# scatterplotUnfold

## 1. What is it？

![image-20220330165607585](C:\Users\19679\AppData\Roaming\Typora\typora-user-images\image-20220330165607585.png)	

​	This is a website we provide to display our visualization result. 

​	**Website address:** [scatterplotUnfold (diyike.github.io)](https://diyike.github.io/scatterplotUnfold/)

## 2. What you can do?

​	In this website, we provide two different ways for you to test the results. 

​	The first one is that we give you the results having been computed. In which you can select the 50 datasets we provide.  Meanwhile, there are five algorithms you can choose, which are original, HaGrid, DGrid, Ours(adjusted r) and Ours(adjustable). Among these algorithms, the original means the results without handling, in which you can change the parameters: radius, transparency and sampling rate; HaGrid means the results were computed by HaGrid algorithm, so as DGrid; Ours(adjusted r) means the results were ran by our algorithms with the fine-tuned parameters and you can not interact with it;  Ours(adjustable) gives you the results made by our algorithm, in which you can adjust the parameters: k, size and r by rerunning our algorithm and you can also operate the  $ f_draw $ area to enhance the .

![image-20220328014151943](C:\Users\19679\AppData\Roaming\Typora\typora-user-images\image-20220328014151943.png)

​	Another way allow you to upload your own JSON data. It is worth noting that the JSON file you upload must have at least four attributes: **id, x, y and color**. The data of uploaded files would be computed by our algorithm and you can change the parameters: k, size and r. After you have uploaded your files, please be patient and you would see the result computed by our algorithm after the spinner on the top disappears.

![image-20220328014326893](C:\Users\19679\AppData\Roaming\Typora\typora-user-images\image-20220328014326893.png)

<img src="C:\Users\19679\AppData\Roaming\Typora\typora-user-images\image-20220328013909134.png" alt="image-20220328013909134" style="zoom: 67%;" />

## 3. How to deploy it on your own computer?

​	To deploy it, you can easily pull the whole project to your computer and run the index.html by opening any server you like, for example, run it by the command of "python -m http.server 8080" on the root directory. 