import java.io.IOException;
import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;

import org.apache.hadoop.io.DoubleWritable;
import org.apache.hadoop.io.IntWritable;
import org.apache.hadoop.io.Text;
import org.apache.hadoop.mapreduce.Reducer;


public class DiffReducer extends Reducer<Text,Text,IntWritable,DoubleWritable>{

	//emit the largest difference in ranks for a particular node
	public void reduce(Text key, Iterable<Text> rankTexts, Context context) throws IOException, InterruptedException 
	{
		HashMap<String,Double> ranks0 = new HashMap<String,Double>();
		HashMap<String,Double> ranks1 = new HashMap<String,Double>();
		int j=0;
		for (Text rankText : rankTexts){
			String[] ranksValues = rankText.toString().split(",");
			for (int i=0; i<ranksValues.length;i++){
                String label = ranksValues[i].substring(0, labelWeight.indexOf("-"));
				String weight = ranksValues[i].substring(labelWeight.indexOf("-")+1);
				
				if (j==0) ranks0.put(label, Double.parseDouble(weight));
				if (j==1) ranks1.put(label, Double.parseDouble(weight));;
			}
			j++;
		}
		
		ArrayList<Double> diffs = new ArrayList<Double>();
		for (String node : ranks0.keySet()){
			if (ranks1.containsKey(node)) { //If this node is already contained within ranks1
				diffs.add(Math.abs( ranks0.get(node)-ranks1.get(node) ));
				ranks1.remove(node);
			}
			else
				diffs.add(Math.abs(ranks0.get(node)));
		}
		
		for (String node:ranks1.keySet()){ 
			diffs.add(Math.abs(ranks1.get(node)));
		}
		
		Collections.sort(diffs);
		
		context.write(new IntWritable(1), new DoubleWritable(diffs.get(diffs.size()-1)));
		
	}
}
