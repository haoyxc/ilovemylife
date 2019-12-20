import org.apache.hadoop.mapreduce.*;

public class InitMapper extends Mapper<LongWritable, Text, Text, Text> {
	
	public void map(LongWritable key, Text value, Context context) 
			throws IOException, InterruptedException {
		
		String v = value.toString();
		String[] friendship = v.split(":");
		String user  = friendship[0];
		String interests = friendship[1];

		context.write(new Text(user), new Text(interests));
		
	}
	

}