import java.io.IOException;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.Iterator;

import org.apache.hadoop.io.IntWritable;
import org.apache.hadoop.io.Text;
import org.apache.hadoop.mapreduce.Reducer;


public class InitReducer extends Reducer<Text,Text,Text,Text>
{
	
	public void reduce(Text key, Iterable <Text> values, Context context) throws IOException, InterruptedException 
	{
		StringBuffer out = new StringBuffer();
		int linkNum = 0; //number of links connecting to other nodes

		ArrayList<String> interests = new ArrayList<String>();
		for(Text v : values){
			String [] splitt = v.toString().split(",");
			if(splitt.length > 1){
				for(int i = 0; i<splitt.length; i++){
					interests.add(splitt[i]);
				}
			} else {
				interests.add(v.toString());
			}

		}
		int numinterests = interests.size(); 

		//initial label and weight
		out.append(key);
		out.append("-");
		out.append(1);
		out.append(";");
		
		double weight=0;
		if (numinterests!=0){
			weight = (float)1/numinterests;
		}

		for(int i = 0; i < interests.size(); i++){
			out.append("*" + interests.get(i) + "-" + weight); 
			out.append(",");
		}

		out.deleteCharAt(out.length()-1);//remove extra comma
	
		
		context.write(key, new Text(out.toString()));
		
	}
}