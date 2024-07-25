### UI for Ultimate Crypto Widget WordPress Plugin
This is the UI for the Ultimate Crypto Widget WordPress Plugin. It is built using React and sass. The UI is designed to be responsive and mobile friendly

### Installation
1. Clone the repository
2. Run `npm install` to install the dependencies
3. Run `npm run dev:ui` to start the development server

### Creating/Setting up a new widget
There is the auto method and the manual method of creating a new widget. The auto method is the easiest and fastest way to create a new widget. The manual method is more flexible and allows you to customize the widget to your taste.

#### Auto Method
1. Run `nnpm run create-widget -- widget-name` to create a new widget. Replace `widget-name` with the name of the widget you want to create.
2. The widget folder will be created in the `react/widgets` folder. witb the name `widget-name` and the following files will be created:
    - `widget-name.tsx` - The main widget file
3. The widget scss file will be created in the `assets/styles/scss` folder with the name `widget-name.scss`

#### Manual Method
1. Create a new folder in the `react/widgets` folder with the name of the widget you want to create.   
2. Create a new file in the folder with the name `widget-name.tsx`. This is the main widget file.
3. Create a new file in the `assets/styles/scss` folder with the name `widget-name.scss`. This is the widget scss file.

### After creating a new widget
1. Go to the index.html file in the root folder and add the widget to the `widgets` object found on line 97. The key should be the name of the widget and the value should be the path to the widget file.
    - Example: 
    ```javascript
    const widgets = {
        ...,
        'widget-name': {
            display_name: 'Widget Name',
            view: 'widget-name',
            card: '', // can be left empty for now
            pro: false, // set to true if the widget is a pro widget
            params: ['coins'],// add the parameters the widget uses to display data
            setting_params: ['count', 'layout'], // add the setting parameters the widget uses to describe the widget layout
        }
    }
    ```
2. Restart the development server by closing the terminal and running `npm run dev:ui` again.