# scatterplotUnfold

## 1. What is it？

​	This is a demo website we provide to display our visualization result.

## 2. What you can do?

​	In this demo, you can select the 50 datasets we provide.  You can also select five algorithms, which are original, HaGrid, DGrid, Ours(adjusted r) and Ours(adjustable). Among those algorithms, the original means the results without handling, in which you can change the parameters: radius, transparency and sampling rate; Ours(adjusted r) means the results are ran by our algorithms with the fine-tuned parameters and you can not interact with it;  Ours(adjustable) gives you the results made by our algorithms and you can adjust the parameters: k, size and r.

![image-20220328014151943](C:\Users\19679\AppData\Roaming\Typora\typora-user-images\image-20220328014151943.png)

​	Meanwhile, you can also upload your own JSON data. It is worth noting that the JSON file you upload must have at least four attributes: ID, x, y and color. The data of uploaded files would be processed by our algorithms and you can choose to change the parameters: k, size and r. After you have uploaded your files, please be patient and you would see the result computed by our algorithm after the spinner on the top disappears.

![image-20220328014326893](C:\Users\19679\AppData\Roaming\Typora\typora-user-images\image-20220328014326893.png)

<img src="C:\Users\19679\AppData\Roaming\Typora\typora-user-images\image-20220328013909134.png" alt="image-20220328013909134" style="zoom: 67%;" />

## 3. How to deploy it on your own computer?

​	To deploy it, you can easily pull the whole project to your computer and run the index.html by opening any server you like, for example, run it by the command of "python -m http.server 8080" on the root directory. 