pragma solidity ^0.5.0;

contract Iotdata {
 // IoT device data
 uint[] log_index;
 mapping (uint => string) data_log;

 event add_data (string data, uint ts);

 string testData = "Hello World";

 function get_testData() public view returns(string memory tstData){
   return testData;
 }

 function set_data (string memory data) public {
   uint ts = now;
   data_log[ts] = data;
   log_index.push(ts);
   emit add_data(data, ts);
 }

 function get_data (uint index) public view returns (string memory data) {
   uint log_ts = log_index[index];
   data = data_log[log_ts];
   return(data);
 }
 function get_latest_data () public view returns (string memory lt_data) {
   uint lt_id = log_index.length-1;
   uint lt_ts = log_index[lt_id];
   lt_data = data_log[lt_ts];
   return(lt_data);
 }
}