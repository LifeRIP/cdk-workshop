// if it's .js, need to add !lambda/*.js to .gitignore

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = async function (event) {
    console.log('Request:', JSON.stringify(event, undefined, 2));
    return {
        statusCode: 200,
        headers: { 'Content-Type': 'text/plain' },
        body: `Hello, CDK I'm a transpiled function! You've hit ${event.path}\n`,
    };
};

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUdBLE9BQU8sQ0FBQyxPQUFPLEdBQUcsS0FBSyxXQUFXLEtBQTJCO0lBQzNELE9BQU8sQ0FBQyxHQUFHLENBQUMsVUFBVSxFQUFFLElBQUksQ0FBQyxTQUFTLENBQUMsS0FBSyxFQUFFLFNBQVMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFBO0lBQzVELE9BQU87UUFDTCxVQUFVLEVBQUUsR0FBRztRQUNmLE9BQU8sRUFBRSxFQUFFLGNBQWMsRUFBRSxZQUFZLEVBQUU7UUFDekMsSUFBSSxFQUFFLDBCQUEwQixLQUFLLENBQUMsSUFBSSxJQUFJO0tBQy9DLENBQUE7QUFDSCxDQUFDLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBpZiBpdCdzIC5qcywgbmVlZCB0byBhZGQgIWxhbWJkYS8qLmpzIHRvIC5naXRpZ25vcmVcclxuaW1wb3J0IHsgQVBJR2F0ZXdheVByb3h5RXZlbnQgfSBmcm9tIFwiYXdzLWxhbWJkYVwiXHJcblxyXG5leHBvcnRzLmhhbmRsZXIgPSBhc3luYyBmdW5jdGlvbiAoZXZlbnQ6IEFQSUdhdGV3YXlQcm94eUV2ZW50KSB7XHJcbiAgY29uc29sZS5sb2coJ1JlcXVlc3Q6JywgSlNPTi5zdHJpbmdpZnkoZXZlbnQsIHVuZGVmaW5lZCwgMikpXHJcbiAgcmV0dXJuIHtcclxuICAgIHN0YXR1c0NvZGU6IDIwMCxcclxuICAgIGhlYWRlcnM6IHsgJ0NvbnRlbnQtVHlwZSc6ICd0ZXh0L3BsYWluJyB9LFxyXG4gICAgYm9keTogYEhlbGxvLCBDREshIFlvdSd2ZSBoaXQgJHtldmVudC5wYXRofVxcbmAsXHJcbiAgfVxyXG59Il19