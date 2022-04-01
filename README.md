# scatterplotUnfold

## 1. What is it？

![image](https://github.com/diyike/ImagesStore/blob/main/scatterplotUnfold/cover.jpg?raw=true)

​	This is a website we provide to display our visualization result. 

​	**Website address:** [scatterplotUnfold (diyike.github.io)](https://diyike.github.io/scatterplotUnfold/)

## 2. What you can do?

​	In this website, we provide two different ways for you to test the results. 

​	The first one is that we give you the results having been computed. In which you can select the 50 datasets we provide.  Meanwhile, there are five algorithms you can choose, which are original, HaGrid, DGrid, Ours(adjusted r) and Ours(adjustable). Among these algorithms, the original means the results without handling, in which you can change the parameters: radius, transparency and sampling rate; HaGrid means the results were computed by HaGrid algorithm, so as DGrid; Ours(adjusted r) means the results were ran by our algorithms with the fine-tuned parameters and you can not interact with it;  Ours(adjustable) gives you the results made by our algorithm, in which you can adjust the parameters: k, size and r by rerunning our algorithm and you can also operate the  f<sub>draw</sub>  area to enhance the .

​	Another way allow you to upload your own JSON data. It is worth noting that the JSON file you upload must have at least four attributes: **id, x, y and color**. The data of uploaded files would be computed by our algorithm and you can change the parameters: k, size and r. After you have uploaded your files, please be patient and you would see the result computed by our algorithm after the spinner on the top disappears.

## 3. Some operation tips

### 3.1  Some basic functions

​	To alter the datasets we provided or the algorithms, you can use the select bars. To upload your own JSON files, you need to click the button "upload json file".

![image](https://github.com/diyike/ImagesStore/blob/main/scatterplotUnfold/select_bar.jpg?raw=true)

​	In the drawing area, we provide three different functions, which are "save result as img", "save result as JSON file" and "change background color" respectively.

![image](https://github.com/diyike/ImagesStore/blob/main/scatterplotUnfold/color_contrast.png?raw=true)

### 3.2 the operation provided for Ours(adjustable) and upload files

![image](https://github.com/diyike/ImagesStore/blob/main/scatterplotUnfold/ours(adjustable).jpg?raw=true)

​	For ours(adjustable) and the files users uploaded, including the drawing area, the radius configuration area and parameter control area are also available.  In the radius configuration area, there are two red circles can be used to change the radius, which is very helpful in improving the visual quality. To make it, you need to click the update button. In the parameter control area, you can change the k and size. Once you do it, the results will be recomputed by our algorithm immediately. 

![image](https://github.com/diyike/ImagesStore/blob/main/scatterplotUnfold/ours(adjustable)_handle.jpg?raw=true)

### 3.3  the operation provided for Original

![image](https://github.com/diyike/ImagesStore/blob/main/scatterplotUnfold/original.jpg?raw=true)

​	For original, you can use the appearance control area to change the radius, transparency and sampling rate. Once you move the sliders, the result would be updated immediately.

### 3.4 the operation provided for others

![image](https://github.com/diyike/ImagesStore/blob/main/scatterplotUnfold/others.jpg?raw=true)

​	For HaGrid, DGrid and Ours(adjusted r), you can only get the results with no additional operation. All the other sections would turn to grey.

## 3. Result analysis

<img src="https://github.com/diyike/ImagesStore/blob/main/scatterplotUnfold/quantitative_results.png?raw=true" alt="image" style="zoom:80%;" />

![image](https://github.com/diyike/ImagesStore/blob/main/scatterplotUnfold/teaser.png?raw=true)

![image](https://github.com/diyike/ImagesStore/blob/main/scatterplotUnfold/dataset_volume.png?raw=true)

![image](https://github.com/diyike/ImagesStore/blob/main/scatterplotUnfold/other_examples.png?raw=true)

## 4. How to deploy it on your own computer?

​	To deploy it, you can easily pull the whole project to your computer and run the index.html by opening any server you like, for example, run it by the command of "python -m http.server 8080" on the root directory. 